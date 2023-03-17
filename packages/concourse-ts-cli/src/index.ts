import 'ts-node/register/transpile-only'

import { Command } from 'commander'

import pkg from '../package.json'

export { run_compile_command } from '../src/commands/compile'
export { run_decompile_command } from '../src/commands/decompile'

import { run_compile_command } from '../src/commands/compile'
import { run_decompile_command } from '../src/commands/decompile'

const program = new Command()

program.name(pkg.name).description(pkg.description).version(pkg.version)

program
  .command('compile')
  .description('Compiles a concourse-ts pipeline into yaml')
  .option('-o, --output <path>', 'path of the file to write into (default: stdout)')
  .option('-i, --input <path>', 'path of the file to read from (default: stdin)')
  .option('-f, --force', 'overwrite output path if it exists')
  .option(
    '-e, --extract-tasks',
    'if set, tasks in the will reference files instead of embedding'
  )
  .action(run_compile_command)

program
  .command('decompile')
  .description('Decompiles a yaml file into concourse-ts code')
  .option('-o, --output <path>', 'path of the file to write into (default: stdout)')
  .option('-i, --input <path>', 'path of the file to read from (default: stdin)')
  .option(
    '-p, --package <path>',
    'the name of the NPM package to import components from',
    '@decentm/concourse-ts'
  )
  .action(run_decompile_command)

program.parse()
