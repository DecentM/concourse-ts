import { Command } from '../../components/index.js'
import { Customiser } from '../../declarations/index.js'

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
