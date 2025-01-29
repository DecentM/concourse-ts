import { Option } from 'commander'
import { merge } from 'ts-deepmerge'

import { CliCommand } from '../../command.js'
import { with_error_handling } from '../../lib/with-error-handling.js'

import { CompileParams, run_compile_command } from './index.js'

export class CompileCommand extends CliCommand {
  constructor(defaults?: Partial<CompileParams>) {
    super('compile')

    this.description('Compiles a concourse-ts pipeline into yaml')
      .addOption(
        new Option('-p, --project', 'relative path to a "tsconfig.json" file')
      )
      .action((params: CompileParams) =>
        with_error_handling(() => run_compile_command(
          merge.withOptions({ mergeArrays: false }, defaults ?? {}, params)
        ))
      )
  }
}
