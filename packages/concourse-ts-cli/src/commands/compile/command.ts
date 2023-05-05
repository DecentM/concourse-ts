import { Option } from 'commander'

import { CliCommand } from '../../command'
import { run_compile_command } from '.'

export class CompileCommand extends CliCommand {
  constructor() {
    super('compile')

    this.description('Compiles a concourse-ts pipeline into yaml')
      .addOption(
        new Option(
          '-p, --project',
          'relative path to a "tsconfig.json" file'
        ).default('tsconfig.json')
      )
      .addOption(
        new Option(
          '-e, --extract-tasks',
          'if set, tasks in the will reference files instead of embedding'
        )
      )
      .action(run_compile_command)
  }
}
