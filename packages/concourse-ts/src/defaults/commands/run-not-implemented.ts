import {Command} from '../../components/command'

export const RunNotImplementedCommand = new Command(
  'RunNotImplemented',
  (command) => {
    command.path = 'echo'
    command.dir = '.'

    command.add_arg(
      `[concourse-ts] "run" not implemented for command ${command.name}, skipping...`
    )
  }
)
