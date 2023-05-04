import 'ts-node/register/transpile-only'

import { Command, Option } from 'commander'
import { Utils } from '@decentm/concourse-ts'

import pkg from '../package.json'

import { run_compile_command } from './commands/compile'
import { run_decompile_command } from './commands/decompile'
import { run_transform_command } from './commands/transform'

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
  .option('-f, --force', 'overwrite output path if it exists')
  .option(
    '-p, --package <path>',
    'the name of the NPM package to import components from',
    '@decentm/concourse-ts'
  )
  .action(run_decompile_command)

program
  .command('transform')
  .description(
    'Transforms a yaml file containing a pipeline based on a select list of transformers'
  )
  .option('-o, --output <path>', 'path of the file to write into (default: stdout)')
  .option('-i, --input <path>', 'path of the file to read from (default: stdin)')
  .option('-f, --force', 'overwrite output path if it exists')
  .addOption(
    new Option('-t --transformers [transformers...]', 'list of transformers to use')
      .choices(Object.keys(Utils.Transform))
      .default([])
  )
  .action(run_transform_command)

program.parse()
