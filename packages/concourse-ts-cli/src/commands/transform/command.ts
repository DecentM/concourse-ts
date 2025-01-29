import { Utils } from '@decentm/concourse-ts'

import { Option } from 'commander'
import { merge } from 'ts-deepmerge'

import { CliCommand } from '../../command.js'
import { with_error_handling } from '../../lib/with-error-handling.js'

import { TransformParams, run_transform_command } from './index.js'

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
        ).choices(Object.keys(Utils.Transform))
      )
      .action((params: TransformParams) =>
        with_error_handling(() => run_transform_command(
          merge.withOptions({ mergeArrays: false }, defaults ?? {}, params)
        ))
      )
  }
}
