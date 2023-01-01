import * as fs from 'node:fs/promises'
import {existsSync} from 'node:fs'
import path from 'node:path'

import {useEffect, useState} from 'react'
import glob from 'fast-glob'
import VError from 'verror'
import mkdirp from 'mkdirp'

import {CompileProps} from '..'

import {Pipeline} from '../../../../../components/pipeline'
import {Task} from '../../../../../components/task'
import {compile} from '../../../../../index'

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

  // Default export must return a Pipeline or Task instance
  if (
    !(file.default() instanceof Pipeline) &&
    !(file.default() instanceof Task)
  ) {
    return false
  }

  return true
}

const isPipeline = (input: Pipeline | Task): input is Pipeline => {
  return input instanceof Pipeline
}

const getType = (input: Pipeline | Task): 'pipeline' | 'task' => {
  return isPipeline(input) ? 'pipeline' : 'task'
}

const getPipelineOrTaskFromFile = (filePath: string): Pipeline | Task => {
  const fullPath = path.resolve(filePath)

  if (!fileValid(fullPath)) {
    throw new VError(
      `${filePath} failed validation. Make sure your glob only resolves to Typescript files with a default export that returns a Pipeline instance.`
    )
  }

  const file = require(fullPath)
  return file.default()
}

type UseCompileFileState = {
  type: 'pipeline' | 'task' | null
  name: string | null
  status: 'started' | 'errored' | 'failed' | 'compiled'
  error: string | null
}

export const useCompile = (props: CompileProps) => {
  const [loading, setLoading] = useState(true)
  const [fileState, _setFileState] = useState<{
    [key in string]: UseCompileFileState
  }>({})

  const setFileState = (name: string, state: UseCompileFileState) => {
    _setFileState((prev) => ({
      ...prev,
      [name]: state,
    }))
  }

  useEffect(() => {
    const outputDir = path.resolve(props.outputDirectory)

    Object.entries(fileState)
      .filter(([file, state]) => state.status === 'started')
      .map(async ([file, state]) => {
        try {
          const pipelineOrTask = getPipelineOrTaskFromFile(file)
          const yamlString = compile(pipelineOrTask)

          const outputPath = path.join(outputDir, getType(pipelineOrTask))

          await mkdirp(outputPath)
          await fs.writeFile(
            path.join(outputPath, `${pipelineOrTask.name}.yml`),
            yamlString
          )

          setFileState(file, {
            type: getType(pipelineOrTask),
            name: pipelineOrTask.name,
            status: 'compiled',
            error: null,
          })
        } catch (error) {
          try {
            const pipelineOrTask = getPipelineOrTaskFromFile(file)

            setFileState(file, {
              type: getType(pipelineOrTask),
              name: pipelineOrTask.name,
              status: 'errored',
              error: error.message,
            })
          } catch (error2) {
            setFileState(file, {
              type: null,
              name: null,
              status: 'failed',
              error: error2.message,
            })
          }
        }
      })
  }, [fileState])

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

    globs.then((result) => {
      if (!result || result.length === 0) {
        throw new VError('Glob input matched no files. Aborting.')
      }

      setLoading(false)

      result.forEach((item) => {
        setFileState(item, {
          type: null,
          name: null,
          status: 'started',
          error: null,
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
