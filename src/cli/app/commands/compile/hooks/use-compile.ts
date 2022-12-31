import * as fs from 'node:fs/promises'
import {existsSync} from 'node:fs'
import path from 'node:path'

import {useEffect, useState} from 'react'
import glob from 'fast-glob'
import VError from 'verror'
import mkdirp from 'mkdirp'

import {CompileProps} from '..'
import {Pipeline} from '~/components/pipeline'
import {useApp} from 'ink'
import {compile} from '~/index'

const fileValid = (filePath: string) => {
  // Must be a Typescript file
  if (!filePath.endsWith('.ts')) {
    return false
  }

  const file = require(filePath)

  // Must have a default export
  if (!('default' in file)) {
    return false
  }

  // Default export must be a function
  if (typeof file.default !== 'function') {
    return false
  }

  // Default export must return a Pipeline instance
  if (!(file.default() instanceof Pipeline)) {
    return false
  }

  return true
}

const getPipelineFromFile = (filePath: string): Pipeline => {
  if (!fileValid(filePath)) {
    throw new VError(
      `${filePath} failed validation. Make sure your glob only resolves to Typescript files with a default export that returns a Pipeline instance.`
    )
  }

  const file = require(filePath)
  return file.default()
}

type UseCompileFileState = {
  pipeline: string | null
  status: 'started' | 'errored' | 'failed' | 'compiled'
  error: string | null
}

export const useCompile = (props: CompileProps) => {
  const [loading, setLoading] = useState(true)
  const [fileState, _setFileState] = useState<{
    [key in string]: UseCompileFileState
  }>({})
  const {exit} = useApp()

  const setFileState = (name: string, state: UseCompileFileState) => {
    _setFileState({
      ...fileState,
      [name]: state,
    })
  }

  useEffect(() => {
    const globs = glob(props.input, {
      cwd: process.cwd(),
    })

    const outputDir = path.resolve(props.outputDirectory)

    if (existsSync(outputDir)) {
      throw new VError(
        'Output directory already exists, refusing to override. Clean the output directory before compiling.'
      )
    }

    globs
      .then((result) => {
        if (!result || result.length === 0) {
          throw new VError('Your glob input matched no files. Aborting.')
        }

        return Promise.all(
          result.map(async (item) => {
            try {
              setFileState(item, {
                pipeline: null,
                status: 'started',
                error: null,
              })

              const pipeline = getPipelineFromFile(item)
              const yamlString = compile(pipeline)

              const outputPath = path.join(outputDir, `${pipeline.name}.yml`)

              await mkdirp(outputDir)
              await fs.writeFile(outputPath, yamlString)

              setFileState(item, {
                pipeline: pipeline.name,
                status: 'compiled',
                error: null,
              })
            } catch (error) {
              try {
                const pipeline = getPipelineFromFile(item)

                setFileState(item, {
                  pipeline: pipeline.name,
                  status: 'errored',
                  error: error.message,
                })
              } catch (error2) {
                setFileState(item, {
                  pipeline: null,
                  status: 'failed',
                  error: error2.message,
                })
              }
            }
          })
        )
      })
      .then(() => {
        setTimeout(() => {
          exit()
        }, 0)
      })
      .finally(() => {
        setLoading(false)
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
