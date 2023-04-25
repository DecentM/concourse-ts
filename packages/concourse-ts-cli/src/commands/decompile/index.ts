import * as ConcourseTs from '@decentm/concourse-ts'
import VError from 'verror'

import { rimraf } from 'rimraf'
import glob from 'fast-glob'
import fsp from 'fs/promises'
import fs from 'fs'
import path from 'path'
import { mkdirp } from 'mkdirp'

export type ImportEventMap = {
  globs: (files: string[]) => void
  error: (error: VError) => void
  warning: (warning: ConcourseTs.Utils.ValidationWarning) => void
  output: (file: string) => void
  end: () => void
}

export type DecompileParams = {
  output?: string
  package_path?: string
  input?: string
  force?: boolean
}

const is_empty = (path: string) => {
  return fs.readdirSync(path).length === 0
}

const resolve_inputs = async (
  params: DecompileParams
): Promise<Array<{ filepath: string; content: string }>> => {
  if (params.input) {
    const globs = await glob(params.input, {
      cwd: process.cwd(),
    })

    if (!globs || globs.length === 0) {
      return []
    }

    return Promise.all(
      globs.map(async (file) => {
        const buffer = await fsp.readFile(file)

        return {
          filepath: file,
          content: buffer.toString('utf-8'),
        }
      })
    )
  }

  const content = fs.readFileSync(process.stdin.fd, 'utf-8')

  return [
    {
      filepath: '',
      content,
    },
  ]
}

const handle_output = async (
  results: ConcourseTs.Decompiler.DecompilationResult[],
  params: DecompileParams
) => {
  await Promise.all(
    results.map(async (result) => {
      if (result.warnings.has_fatal()) {
        throw new VError(
          new VError(
            result.warnings
              .get_warnings(ConcourseTs.Utils.ValidationWarningType.Fatal)
              .map((warning) => warning.messages.join(', '))
              .join('\n')
          ),
          '[ERROR] Error(s) encountered during decompilation'
        )
      }

      if (result.warnings.has_non_fatal()) {
        result.warnings
          .get_warnings(ConcourseTs.Utils.ValidationWarningType.NonFatal)
          .forEach((warning) => {
            process.stderr.write(`[WARN]: ${warning.messages.join(', ')}\n`)
          })
      }

      if (params.output) {
        const output_path = path.resolve(params.output)

        if (fs.existsSync(output_path) && !is_empty(output_path)) {
          if (params.force) {
            await rimraf(output_path)
          } else {
            throw new VError(
              `Output path "${output_path}" already exists. Pass "-f" to overwrite and clean the output path.`
            )
          }
        }

        await mkdirp(output_path)
        await fsp.writeFile(path.join(output_path, result.filename), result.pipeline)
        return
      }

      fs.writeFileSync(process.stdout.fd, result.pipeline, 'utf-8')
    })
  )
}

export const run_decompile_command = async (params: DecompileParams) => {
  const inputs = await resolve_inputs(params)

  const results = await Promise.all(
    inputs.map(async (input) => {
      const decompilation = new ConcourseTs.Decompiler.Decompilation()
      const path_info = path.parse(input.filepath)

      if (params.package_path) {
        decompilation.set_import_path(params.package_path)
      }

      decompilation.set_name(path_info.name).set_work_dir(path_info.dir)

      return decompilation.decompile(input.content)
    })
  )

  await handle_output(results, params)
}
