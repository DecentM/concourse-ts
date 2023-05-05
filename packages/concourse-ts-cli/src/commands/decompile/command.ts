import { Option } from 'commander'

import { CliCommand } from '../../command'
import { run_decompile_command } from '.'

export class DecompileCommand extends CliCommand {
  constructor() {
    super('decompile')

    this.description('Decompiles a yaml file into concourse-ts code')
      .addOption(
        new Option(
          '-p, --package <path>',
          'the name of the NPM package to import components from'
        ).default('@decentm/concourse-ts')
      )
      .action(run_decompile_command)
  }
}
