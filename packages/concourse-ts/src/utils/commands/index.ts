import { Command } from '../../components/index.js'
import { Customiser } from '../../declarations/index.js'

/**
 * Joins multiple commands into a single command, by a provided joiner.
 * Any "user" and "dir" properties will be taken from the first command that has them,
 * and applied to the result. You must set these properties in the customiser
 * explicitly if you want to avoid this behaviour.
 *
 * ----
 *
 * Example:
 * ```typescript
 * const final_command = join_commands((args, command) => {
 *   command.path = '/bin/sh'
 *
 *   command.add_arg('-exuc')
 *   command.add_arg(args.join(' && '))
 * }, command_a, command_b)
 * ```
 *
 * This will create a new command that runs `command_a` and `command_b` in
 * sequence, separated by `&&` to run them sequentially.
 *
 * ----
 *
 * @param {Type.Customiser<Command>} customise Customiser to apply to the resulting command
 * @param {Command[]} commands Commands to join
 * @returns {Command}
 */
export const join_commands = (
  customise: Customiser<string[], Command>,
  ...commands: Command[]
): Command => {
  const args: string[] = []

  let dir = ''
  let user = ''

  commands.forEach((command) => {
    const serialised = command.serialise()

    if (!dir && serialised.dir) {
      dir = serialised.dir
    }

    if (!user && serialised.user) {
      user = serialised.user
    }

    args.push(
      `${serialised.path} ${serialised.args
        .map((arg) => JSON.stringify(arg))
        .join(' ')}`
    )
  })

  return new Command((command) => {
    if (dir) command.dir = dir
    if (user) command.user = user

    customise(args, command)
  })
}
