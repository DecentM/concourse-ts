import { Utils } from '@decentm/concourse-ts'
import { Option } from 'commander'

import { CliCommand } from '../../command'
import { run_transform_command } from '.'

export class TransformCommand extends CliCommand {
  constructor() {
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
      .action(run_transform_command)
  }
}
