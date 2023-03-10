import {Command} from '../../components'

export const join_commands = (
  name: string,
  joiner: (args: string[]) => string,
  ...commands: Command[]
): Command => {
  const args: string[] = []

  commands.forEach((command) => {
    const serialised = command.serialise()

    args.push(
      `${serialised.path} ${serialised.args
        .map((arg) => JSON.stringify(arg))
        .join(' ')}`
    )
  })

  return new Command(name, (command) => {
    command.add_arg(joiner(args))
  })
}
