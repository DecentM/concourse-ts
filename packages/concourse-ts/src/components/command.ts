import {Customiser} from '../declarations/customiser'
import * as Type from '../declarations/types'

export class Command {
  private static customiser: Customiser<Command>

  public static customise = (init: Customiser<Command>) => {
    Command.customiser = init
  }

  constructor(public name: string, customise?: Customiser<Command>) {
    if (Command.customiser) {
      Command.customiser(this)
    }

    if (customise) {
      customise(this)
    }
  }

  public path: Type.FilePath

  private args: string[] = []

  public add_arg = (arg: string) => {
    this.args.push(arg)
  }

  public dir: Type.DirPath

  public user: string

  serialise() {
    const result: Type.Command = {
      path: this.path,
      args: this.args,
      dir: this.dir,
      user: this.user,
    }

    return result
  }
}
