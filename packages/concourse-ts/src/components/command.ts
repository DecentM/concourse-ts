import {VError} from 'verror'

import {Initer} from '../declarations/initialisable'
import * as Type from '../declarations/types'
import {type_of} from '../utils'

export class Command {
  constructor(public name: string, init?: Initer<Command>) {
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

  static deserialise(name: string, input: Type.Command) {
    return new Command(name, (command) => {
      command.args = input.args
      command.path = input.path
      command.dir = input.dir
      command.user = input.user
    })
  }

  public write() {
    return `new Command(${JSON.stringify(this.name)}, (command) => {
      ${JSON.stringify(
        this.args.map((arg) => `command.add_arg(${JSON.stringify(arg)})`)
      )}

      ${
        type_of(this.path) !== 'undefined'
          ? `command.path = ${JSON.stringify(this.path)}`
          : ''
      }

      ${
        type_of(this.dir) !== 'undefined'
          ? `command.dir = ${JSON.stringify(this.dir)}`
          : ''
      }

      ${
        type_of(this.user) !== 'undefined'
          ? `command.user = ${JSON.stringify(this.user)}`
          : ''
      }
    })`
  }
}
