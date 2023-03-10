import VError from 'verror'

import {CliCommand} from '../abstract'

import {ValidationWarning} from '../../../utils/warning-store'
import {Pipeline} from '../../../components/pipeline'
import {Compilation} from '../../../compiler/compilation'

import glob from 'fast-glob'
import fs from 'fs/promises'
import {existsSync} from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'

export type CompileEventMap = {
  globs: (files: string[]) => void
  error: (error: VError) => void
  warning: (warning: ValidationWarning) => void
  output: (file: string) => void
  end: () => void
}

export type CompileParams = {
  output_directory?: string
  extract_tasks?: boolean
  input: string
}

const file_valid = async (file_path: string) => {
  // Must be a Typescript file
  if (!file_path.endsWith('.ts') && !file_path.endsWith('.js')) {
    return false
  }

  const file = await import(file_path)

  // Default export must be a function
  if (!('default' in file) || typeof file.default !== 'function') {
    return false
  }

  // Default export must return a Pipeline or Task instance, or a Promise that
  // resolves to either
  if (!((await file.default()) instanceof Pipeline)) {
    return false
  }

  return true
}

const get_pipeline_from_file = async (file_path: string): Promise<Pipeline> => {
  const fullPath = path.resolve(file_path)

  if (!(await file_valid(fullPath))) {
    throw new VError(
      `${file_path} failed validation. Make sure your glob only resolves to Typescript files with a default export that returns a Pipeline instance.`
    )
  }

  const file = await import(fullPath)

  return file.default()
}

export class Compile extends CliCommand<CompileParams, CompileEventMap> {
  public async run(): Promise<void> {
    const globs = await glob(this.params.input, {
      cwd: process.cwd(),
    })

    this.emit('globs', globs)

    if (!globs || globs.length === 0) {
      this.emit(
        'error',
        new VError(`Glob input "${this.params.input}" matched no files`)
      )
      this.emit('end')
      return
    }

    const output_dir = path.resolve(this.params.output_directory)

    if (existsSync(output_dir)) {
      this.emit(
        'error',
        new VError(
          'Output directory already exists, refusing to override. Clean the output directory before compiling.'
        )
      )
      this.emit('end')
      return
    }

    await Promise.all(
      globs.map(async (file) => {
        try {
          const pipeline = await get_pipeline_from_file(path.resolve(file))
          const compilation = new Compilation({
            output_dir: this.params.output_directory,
            extract_tasks: this.params.extract_tasks,
          })

          compilation.set_input(pipeline)

          const compile_result = compilation.compile()

          compile_result.warnings.get_warnings().forEach((warning) => {
            this.emit('warning', warning)
          })

          await Promise.all([
            mkdirp(path.join(output_dir, 'pipeline')),
            mkdirp(path.join(output_dir, 'task')),
          ])

          await Promise.all([
            fs.writeFile(
              compile_result.pipeline.filepath,
              compile_result.pipeline.content
            ),

            ...compile_result.tasks.map((taskResult) =>
              fs.writeFile(taskResult.filepath, taskResult.content)
            ),
          ])

          this.emit('output', compile_result.pipeline.filepath)
        } catch (error) {
          this.emit('error', error)
        }
      })
    )

    this.emit('end')
  }
}
