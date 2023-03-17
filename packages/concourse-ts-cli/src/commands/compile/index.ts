import * as ConcourseTs from '@decentm/concourse-ts'
import VError from 'verror'
import { transpile, ScriptTarget } from 'typescript'

import glob from 'fast-glob'
import fs from 'fs'
import fsp from 'fs/promises'
import path from 'path'
import mkdirp from 'mkdirp'

export type CompileParams = {
  output?: string
  extract_tasks?: boolean
  force?: boolean
  input?: string
}

const file_contents_valid = async (input: object) => {
  // Default export must be a function
  if (!('default' in input) || typeof input.default !== 'function') {
    return false
  }

  // Default export must return a serialisable
  if (!(await input.default()).serialise) {
    return false
  }

  return true
}

const file_valid = async (file_path: string) => {
  // Must be a Typescript file
  if (!file_path.endsWith('.ts') && !file_path.endsWith('.js')) {
    return false
  }

  const file = await import(file_path)

  return file_contents_valid(file)
}

const get_pipeline_from_file = async (
  file_path: string
): Promise<ConcourseTs.Pipeline> => {
  const fullPath = path.resolve(file_path)

  if (!(await file_valid(fullPath))) {
    throw new VError(
      `${file_path} failed validation. Make sure your glob only resolves to Typescript files with a default export that returns a Pipeline instance.`
    )
  }

  const file = await import(fullPath)

  return file.default()
}

const resolve_pipelines = async (
  params: CompileParams
): Promise<ConcourseTs.Pipeline[]> => {
  if (params.input) {
    const globs = await glob(params.input, {
      cwd: process.cwd(),
    })

    if (!globs || globs.length === 0) {
      return []
    }

    return Promise.all(globs.map((file) => get_pipeline_from_file(file)))
  }

  const file_string = fs.readFileSync(process.stdin.fd, 'utf-8')
  const file = eval(
    transpile(file_string, {
      target: ScriptTarget.ES2016,
    })
  )

  if (!file_contents_valid(file)) {
    return []
  }

  return [file]
}

const handle_output = async (
  results: ConcourseTs.Compiler.CompilationResult[],
  params: CompileParams
) => {
  if (params.output) {
    const output_path = path.resolve(params.output)

    if (fs.existsSync(output_path) && !params.force) {
      throw new VError(
        `Output file "${params.output}" already exists. Pass "-f" to overwrite.`
      )
    }

    await Promise.all([
      mkdirp(path.join(params.output, 'pipeline')),
      mkdirp(path.join(params.output, 'task')),
    ])

    await Promise.all(
      results.map((result) => {
        return Promise.all([
          fsp.writeFile(result.pipeline.filepath, result.pipeline.content, {
            encoding: 'utf-8',
          }),

          ...result.tasks.map((taskResult) =>
            fsp.writeFile(taskResult.filepath, taskResult.content, {
              encoding: 'utf-8',
            })
          ),
        ])
      })
    )

    return
  }

  results.forEach((result) => {
    fs.writeFileSync(process.stdout.fd, result.pipeline.content, {
      encoding: 'utf-8',
    })
  })
}

export const run_compile_command = async (params: CompileParams) => {
  const pipelines = await resolve_pipelines(params)

  const results = await Promise.all(
    pipelines.map((pipeline) => {
      const compilation = new ConcourseTs.Compiler.Compilation({
        output_dir: params.output ?? '.',
        extract_tasks: params.extract_tasks ?? false,
      })

      const result = compilation.compile(pipeline)

      if (result.warnings.has_fatal()) {
        throw new VError(
          new VError(
            result.warnings
              .get_warnings(ConcourseTs.Utils.ValidationWarningType.Fatal)
              .map((warning) => warning.messages.join(', '))
              .join('\n')
          ),
          '[ERROR] Error(s) encountered during compilation'
        )
      }

      if (result.warnings.has_non_fatal()) {
        result.warnings
          .get_warnings(ConcourseTs.Utils.ValidationWarningType.NonFatal)
          .forEach((warning) => {
            process.stderr.write(`[WARN]: ${warning.messages.join(', ')}\n`)
          })
      }

      return result
    })
  )

  await handle_output(results, params)
}
