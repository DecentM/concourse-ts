import * as ConcourseTs from '@decentm/concourse-ts'

import path from 'path'
import * as YAML from 'yaml'

import { HandleOutputParams, handle_output } from '../../lib/handle-output'
import { HandleInputParams, handle_inputs } from '../../lib/handle-inputs'

export type TransformParams = HandleInputParams &
  HandleOutputParams & {
    transformers?: Array<keyof typeof ConcourseTs.Utils.Transform>
    options?: {
      [K in keyof typeof ConcourseTs.Utils.Transform]?: Parameters<
        (typeof ConcourseTs.Utils.Transform)[K]
      >[1]
    }
  }

export const run_transform_command = async (params: TransformParams) => {
  const inputs = await handle_inputs(params, '.yml')

  const results = await Promise.all(
    inputs.map(async (input) => {
      const used_transformers = Object.keys(ConcourseTs.Utils.Transform).filter(
        (transformer) => {
          return Object.keys(params.transformers).includes(transformer)
        }
      ) as Array<keyof typeof ConcourseTs.Utils.Transform>

      const pipeline = YAML.parse(input.content)
      const path_info = path.parse(input.filepath)

      used_transformers.forEach((used_transformer) => {
        const transformer: ConcourseTs.Type.Transformer =
          ConcourseTs.Utils.Transform[used_transformer]

        if (!transformer) {
          return
        }

        const options = params.options[used_transformer]

        transformer(pipeline, options)
      })

      return {
        filename: `${path_info.name}.yml`,
        content: YAML.stringify(pipeline),
      }
    })
  )

  await handle_output(results, params)
}
