import {Command} from '../../components'

export type JoinCommandsInput = {
  name: string
  path?: string
  dir?: string
  user?: string
  joiner?: string
}

export const join_commands = (
  input: JoinCommandsInput,
  ...commands: Command[]
): Command => {
  const args: string[] = []

  commands.forEach((command) => {
    const serialised = command.serialise()

    args.push(`${serialised.path} ${serialised.args.join(' ')}`)
  })

  return new Command(input.name, (command) => {
    command.dir = input.dir
    command.user = input.user

    command.path = input.path ? input.path : '/bin/sh'

    if (!input.path) {
      command.add_arg('-exuc')
    }

    command.add_arg(args.join(input.joiner ?? ' && '))
  })
}
