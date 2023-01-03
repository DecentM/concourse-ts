import {VError} from 'verror'

import {Initer} from '../../declarations/initialisable'
import * as Type from '../../declarations/types'

import {Step} from './_base'

export class LoadVarStep extends Step<Type.LoadVarStep> {
  constructor(public override name: string, init?: Initer<LoadVarStep>) {
    super(name)

    if (init) {
      init(this)
    }
  }

  public load_var?: Type.Identifier

  public file?: Type.FilePath

  public format?: Type.VarFormat

  public reveal = false

  public serialise() {
    if (!this.load_var) {
      throw new VError(
        'Cannot serialise LoadVarStep because "load_var" has not been set'
      )
    }

    if (!this.file) {
      throw new VError(
        `Cannot serialise LoadVarStep, because "file" has not been set`
      )
    }

    const result: Type.LoadVarStep = {
      ...this.serialise_base(),
      load_var: this.load_var,
      file: this.file,
      format: this.format,
      reveal: this.reveal,
    }

    return result
  }
}
