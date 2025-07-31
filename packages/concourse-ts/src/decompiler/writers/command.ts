import { Command } from '../../declarations/index.js'
import { empty_string_or } from '../../utils/empty_string_or/index.js'

export const write_command = (command: Command): string => {
  return `new Command((command) => {
    ${empty_string_or(command.args, (args) =>
      args.map((arg) => `command.add_args(${JSON.stringify(arg)})`).join('\n')
    )}

    ${empty_string_or(
      command.path,
      (path) => `command.path = ${JSON.stringify(path)}`
    )}

    ${empty_string_or(command.dir, (dir) => `command.dir = ${JSON.stringify(dir)}`)}

    ${empty_string_or(
      command.user,
      (user) => `command.user = ${JSON.stringify(user)}`
    )}
  })`
}
