import * as ConcourseTs from '@decentm/concourse-ts'

export class CommandBuilder {
  private command: ConcourseTs.Command

  public build(): ConcourseTs.Command {
    return this.command
  }

  constructor() {
    this.command = new ConcourseTs.Command()
  }

  public path(path: string): CommandBuilder {
    this.command.path = path

    return this
  }

  public arg(arg: string): CommandBuilder {
    this.command.add_arg(arg)

    return this
  }

  public dir(dir: ConcourseTs.Type.DirPath): CommandBuilder {
    this.command.dir = dir

    return this
  }

  public user(user: string): CommandBuilder {
    this.command.user = user

    return this
  }
}
