import {Command} from '../../components'
import {Customiser} from '../../declarations'

export const join_commands = (
  name: string,
  joiner: (args: string[]) => string,
  customise?: Customiser<Command>,
  ...commands: Command[]
): Command => {
  const args: string[] = []

  commands.forEach((command) => {
    const serialised = command.serialise()

    args.push(`${serialised.path} ${serialised.args.join(' ')}`)
  })

  return new Command(name, (command) => {
    command.add_arg(joiner(args))

    if (customise) {
      customise(command)
    }
  })
}
