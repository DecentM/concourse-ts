import 'ts-node/register/transpile-only'

import { Command } from 'commander'

import pkg from '../package.json'

import { CompileCommand } from './commands/compile/command'
import { DecompileCommand } from './commands/decompile/command'
import { TransformCommand } from './commands/transform/command'

const program = new Command()
  .name(pkg.name)
  .description(pkg.description)
  .version(pkg.version)

program
  .addCommand(new CompileCommand())
  .addCommand(new DecompileCommand())
  .addCommand(new TransformCommand())

export { program }
