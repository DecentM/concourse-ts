import {Command} from '../../declarations'
import {type_of} from '../../utils'

export const write_command = (name: string, command: Command): string => {
  return `new Command(${JSON.stringify(name)}, (command) => {
    ${command.args
      .map((arg) => `command.add_arg(${JSON.stringify(arg)})`)
      .join('\n')}

    ${
      type_of(command.path) !== 'undefined'
        ? `command.path = ${JSON.stringify(command.path)}`
        : ''
    }

    ${
      type_of(command.dir) !== 'undefined'
        ? `command.dir = ${JSON.stringify(command.dir)}`
        : ''
    }

    ${
      type_of(command.user) !== 'undefined'
        ? `command.user = ${JSON.stringify(command.user)}`
        : ''
    }
  })`
}
