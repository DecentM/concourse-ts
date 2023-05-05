import * as ConcourseTs from '@decentm/concourse-ts'
import VError from 'verror'

import { HandleInputParams, handle_inputs } from '../../lib/handle-inputs'
import { HandleOutputParams, handle_output } from '../../lib/handle-output'

export type CompileParams = HandleInputParams &
  HandleOutputParams & {
    project: string
  }

type PipelineFileExportFunction =
  | (() => ConcourseTs.Pipeline)
  | (() => Promise<ConcourseTs.Pipeline>)

type PipelineFileExport =
  | PipelineFileExportFunction
  | { default: PipelineFileExportFunction }

const get_pipeline_from_file = async (
  input: PipelineFileExport
): Promise<ConcourseTs.Pipeline> => {
  // Default export must be a function
  if (
    typeof input !== 'function' &&
    (!('default' in input) || typeof input.default !== 'function')
  ) {
    return null
  }

  const default_export =
    typeof input === 'function' ? await input() : await input.default()

  // Default export must return a serialisable
  if (!(default_export instanceof ConcourseTs.Pipeline)) {
    return null
  }

  return default_export
}

export const run_compile_command = async (params: CompileParams) => {
  const inputs = await handle_inputs(params)

  const pipelines = (
    await Promise.all(
      inputs.map(async (input) => {
        const file = await import(input.filepath)

        return get_pipeline_from_file(file)
      })
    )
  ).filter(Boolean)

  const results = await Promise.all(
    pipelines.map((pipeline) => {
      const compilation = new ConcourseTs.Compiler.Compilation()

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

  await handle_output(
    results.map((result) => ({
      content: result.pipeline.content,
      filename: result.pipeline.filename,
    })),
    params
  )
}
