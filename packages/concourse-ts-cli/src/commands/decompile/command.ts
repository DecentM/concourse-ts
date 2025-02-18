import { Option } from 'commander'
import { merge } from 'ts-deepmerge'

import { CliCommand } from '../../command.js'
import { with_error_handling } from '../../lib/with-error-handling.js'

import { DecompileParams, run_decompile_command } from './index.js'

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
        with_error_handling(() => run_decompile_command(
          merge.withOptions({ mergeArrays: false }, defaults ?? {}, params)
        ))
      )
  }
}
