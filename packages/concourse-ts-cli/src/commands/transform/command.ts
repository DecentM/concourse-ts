import { Utils } from '@decentm/concourse-ts'

import { Option } from 'commander'
import deep_merge from 'ts-deepmerge'

import { CliCommand } from '../../command'
import { TransformParams, run_transform_command } from '.'

export class TransformCommand extends CliCommand {
  constructor(defaults?: Partial<TransformParams>) {
    super('transform')

    this.description(
      'Transforms a yaml file containing a pipeline based on a select list of transformers'
    )
      .addOption(
        new Option(
          '-t --transformers [transformers...]',
          'list of transformers to use'
        )
          .choices(Object.keys(Utils.Transform))
          .default([])
      )
      .action((params: TransformParams) =>
        run_transform_command(
          deep_merge.withOptions({ mergeArrays: false }, defaults ?? {}, params)
        )
      )
  }
}
