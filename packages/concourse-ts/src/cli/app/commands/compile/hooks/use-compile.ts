import * as fs from 'node:fs/promises'
import {existsSync} from 'node:fs'
import path from 'node:path'

import {useEffect, useState} from 'react'
import glob from 'fast-glob'
import {VError} from 'verror'
import mkdirp from 'mkdirp'
import {CompileProps} from '..'

import {Pipeline} from '../../../../../components/pipeline'
import {Task} from '../../../../../components/task'
import {compile} from '../../../../../index'
import {type_of} from '../../../../../utils/type-of'

const loadTypescript = (filePath: string) => {
  if (!path.isAbsolute(filePath)) {
    throw new VError('Internal error', 'Only absolute paths can be imported')
  }

  return import(filePath)
}

const fileValid = async (filePath: string) => {
  // Must be a Typescript file
  if (!filePath.endsWith('.ts')) {
    return false
  }

  const file = await loadTypescript(filePath)

  // Default export must be a function
  if (!('default' in file) || typeof file.default !== 'function') {
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
  if (type_of(input) !== 'object') {
    throw new VError(`Input must be an object. Got ${type_of(input)}`)
  }

  if (!input || !('constructor' in input)) {
    throw new VError(
      `The passed object must be an instance of a class. Got ${type_of(input)}`
    )
  }

  if (input.constructor.name === Task.name) {
    return false
  }

  if (input.constructor.name === Pipeline.name) {
    return true
  }

  throw new VError(
    `Either a Pipeline or Task must be passed, but got ${type_of(input)}`
  )
}

export const getType = (input: Pipeline | Task): 'pipeline' | 'task' => {
  return isPipeline(input) ? 'pipeline' : 'task'
}

const getPipelineFromFile = async (filePath: string): Promise<Pipeline> => {
  const fullPath = path.resolve(filePath)

  if (!(await fileValid(fullPath))) {
    throw new VError(
      `${filePath} failed validation. Make sure your glob only resolves to Typescript files with a default export that returns a Pipeline instance.`
    )
  }

  const file = await loadTypescript(fullPath)

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
      .filter(([, state]) => state.status === 'started')
      .forEach(async ([file]) => {
        try {
          const pipeline = await getPipelineFromFile(path.resolve(file))

          const compileResult = compile(pipeline, props.outputDirectory)

          await Promise.all([
            mkdirp(path.join(outputDir, 'pipeline')),
            mkdirp(path.join(outputDir, 'task')),
          ])

          await Promise.all([
            fs.writeFile(
              compileResult.pipeline.filepath,
              compileResult.pipeline.content
            ),

            ...compileResult.tasks.map((taskResult) =>
              fs.writeFile(taskResult.filepath, taskResult.content)
            ),
          ])

          setFileState(file, {
            type: 'pipeline',
            name: pipeline.name,
            status: 'compiled',
            error: null,
          })
        } catch (error) {
          try {
            const pipeline = await getPipelineFromFile(file)

            setFileState(file, {
              type: 'pipeline',
              name: pipeline.name,
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
