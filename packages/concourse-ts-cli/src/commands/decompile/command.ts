import { Option } from 'commander'
import deep_merge from 'ts-deepmerge'

import { CliCommand } from '../../command'
import { DecompileParams, run_decompile_command } from '.'

export class DecompileCommand extends CliCommand {
  constructor(defaults?: Partial<DecompileParams>) {
    super('decompile')

    this.description('Decompiles a yaml file into concourse-ts code')
      .addOption(
        new Option(
          '-p, --package <path>',
          'the name of the NPM package to import components from'
        )
      )
      .action((params: DecompileParams) =>
        run_decompile_command(
          deep_merge.withOptions({ mergeArrays: false }, defaults, params)
        )
      )
  }
}
