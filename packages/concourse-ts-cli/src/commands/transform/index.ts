import * as ConcourseTs from '@decentm/concourse-ts'

import path from 'path'
import * as YAML from 'yaml'

import { HandleOutputParams, handle_output } from '../../lib/handle-output'
import { HandleInputParams, handle_inputs } from '../../lib/handle-inputs'

export type TransformParams = HandleInputParams &
  HandleOutputParams & {
    transformers?: string[]
  }

export const run_transform_command = async (params: TransformParams) => {
  const inputs = await handle_inputs(params)

  const results = await Promise.all(
    inputs.map(async (input) => {
      const path_info = path.parse(input.filepath)
      const used_transformers = Object.keys(ConcourseTs.Utils.Transform).filter(
        (transformer) => {
          return params.transformers.includes(transformer)
        }
      )

      const pipeline = YAML.parse(input.content)

      used_transformers.forEach((used_transformer) => {
        const transformer: ConcourseTs.Type.Transformer =
          ConcourseTs.Utils.Transform[used_transformer]

        if (!transformer) {
          return
        }

        transformer(pipeline, path_info.dir)
      })

      return {
        filename: `${path_info.name}.yml`,
        content: YAML.stringify(pipeline),
      }
    })
  )

  await handle_output(results, params)
}
