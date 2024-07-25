import * as ConcourseTs from '@decentm/concourse-ts'
import VError from 'verror'

import path from 'node:path'

import { HandleOutputParams, handle_output } from '../../lib/handle-output.js'
import { HandleInputParams, handle_inputs } from '../../lib/handle-inputs.js'

export type ImportEventMap = {
  globs: (files: string[]) => void
  error: (error: VError) => void
  warning: (warning: ConcourseTs.Utils.ValidationWarning) => void
  output: (file: string) => void
  end: () => void
}

export type DecompileParams = HandleInputParams &
  HandleOutputParams & {
    package?: string
  }

export const run_decompile_command = async (params: DecompileParams) => {
  const inputs = await handle_inputs(params, '.yml')

  const results = await Promise.all(
    inputs.map(async (input) => {
      const decompilation = new ConcourseTs.Decompiler.Decompilation()

      if (params.package) {
        decompilation.set_import_path(params.package)
      }

      const path_info = path.parse(input.filepath)
      decompilation.set_name(path_info.name).set_work_dir(process.cwd())

      return decompilation.decompile(input.content)
    })
  )

  results.forEach((result) => {
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
  })

  await handle_output(
    results.map((result) => ({
      content: result.pipeline,
      filename: result.filename,
    })),
    params
  )
}
