import {Command} from '../../components/command'

export class RunNotImplemented extends Command {
  constructor() {
    super('RunNotImplemented')

    this.path = 'echo'
    this.dir = '.'

    this.add_arg(
      `[concourse-ts] "run" not implemented for command, skipping...`
    )
  }
}
