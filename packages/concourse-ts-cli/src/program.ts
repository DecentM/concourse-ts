import { Command } from 'commander'

import pkg from '../package.json'

import { CompileCommand } from './commands/compile/command.js'
import { DecompileCommand } from './commands/decompile/command.js'
import { TransformCommand } from './commands/transform/command.js'
import { get_config } from './rc.js'

export const get_program = async () => {
  const program = new Command()
    .name(pkg.name)
    .description(pkg.description)
    .version(pkg.version)

  const rc_config = await get_config()

  program
    .addCommand(new CompileCommand(rc_config?.compile))
    .addCommand(new DecompileCommand(rc_config?.decompile))
    .addCommand(new TransformCommand(rc_config?.transform))

  const more_info = [
    'Documentation - https://github.com/DecentM/concourse-ts/wiki',
    'Source - https://github.com/DecentM/concourse-ts',
    'Issues - https://github.com/DecentM/concourse-ts/issues',
  ]

  program.addHelpText(
    'afterAll',
    `\nMore information:\n  ${more_info
      .map((line) => line.padStart(25))
      .join('\n  ')}`
  )

  return program
}
