import * as fs from 'node:fs/promises'
import {existsSync} from 'node:fs'
import path from 'node:path'

import {useEffect, useState} from 'react'
import glob from 'fast-glob'
import {VError} from 'verror'
import mkdirp from 'mkdirp'
import {CompileProps} from '..'

import {Decompilation} from '../../../../../decompiler/decompilation'

type UseDecompileFileState = {
  status: 'started' | 'errored' | 'failed' | 'imported'
}

export const useCompile = (props: CompileProps) => {
  const [loading, setLoading] = useState(true)
  const [fileState, _setFileState] = useState<{
    [key in string]: UseDecompileFileState
  }>({})

  const setFileState = (name: string, state: UseDecompileFileState) => {
    _setFileState((prev) => ({
      ...prev,
      [name]: state,
    }))
  }

  useEffect(() => {
    const outputDir = path.resolve(props.output_directory)

    Object.entries(fileState)
      .filter(([, state]) => state.status === 'started')
      .forEach(async ([file]) => {
        try {
          const decompilation = new Decompilation()
          const fileContents = await fs.readFile(file)
          const pathInfo = path.parse(file)

          decompilation
            .set_name(pathInfo.name)
            .set_input(fileContents.toString('utf-8'))
            .set_prettier_config()
            .set_work_dir(pathInfo.dir)

          const decompileResult = decompilation.decompile()

          await mkdirp(outputDir)

          await fs.writeFile(
            path.resolve(outputDir, decompileResult.filename),
            decompileResult.pipeline
          )

          setFileState(file, {
            status: 'imported',
          })
        } catch (error) {
          console.log(error)

          setFileState(file, {
            status: 'failed',
          })
        }
      })
  }, [fileState])

  useEffect(() => {
    const globs = glob(props.input, {
      cwd: process.cwd(),
    })

    const outputDir = path.resolve(props.output_directory)

    if (existsSync(outputDir)) {
      throw new VError(
        'Output directory already exists, refusing to override. Clean the output directory before compiling.'
      )
    }

    globs.then((result) => {
      if (!result || result.length === 0) {
        throw new VError('Glob input matched no files. Aborting.')
      }

      setLoading(false)

      result.forEach((item) => {
        setFileState(item, {
          status: 'started',
        })
      })
    })
  }, [])

  return {
    loading,
    fileList: Object.keys(fileState).map((key) => {
      const item = fileState[key]

      return {
        file: key,
        ...item,
      }
    }),
  }
}
