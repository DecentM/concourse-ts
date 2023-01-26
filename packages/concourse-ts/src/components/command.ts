import {VError} from 'verror'

import {Initer} from '../declarations/initialisable'
import {Serialisable} from '../declarations/serialisable'
import * as Type from '../declarations/types'

export class Command extends Serialisable<Type.Command> {
  constructor(public name: string, init: Initer<Command>) {
    super()

    if (init) {
      init(this)
    }
  }

  public path: Type.FilePath

  private args: string[]

  public add_arg = (arg: string) => {
    if (!this.args) this.args = []

    this.args.push(arg)
  }

  public dir: Type.DirPath

  public user: string

  serialise() {
    if (!this.path) {
      throw new VError(`Cannot serialise command "${this.name}" without a path`)
    }

    const result: Type.Command = {
      path: this.path,
      args: this.args,
      dir: this.dir,
      user: this.user,
    }

    return result
  }
}
