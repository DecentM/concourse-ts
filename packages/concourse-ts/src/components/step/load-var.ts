import {VError} from 'verror'

import {Initer} from '../../declarations/initialisable'
import * as Type from '../../declarations/types'
import {type_of} from '../../utils'
import {Resource} from '../resource'

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

  public reveal: boolean

  public get_resources(): Resource[] {
    return this.get_base_resources()
  }

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

  public static deserialise(
    name: string,
    resourcePool: Resource[],
    input: Type.LoadVarStep
  ) {
    return new LoadVarStep(name, (step) => {
      this.deserialise_base(step, resourcePool, input)

      step.load_var = input.load_var
      step.file = input.file
      step.format = input.format
      step.reveal = input.reveal
    })
  }

  public write() {
    return `new LoadVarStep(${JSON.stringify(this.name)}, (step) => {
      ${super.write_base('step')}

      ${
        type_of(this.load_var) !== 'undefined'
          ? `step.load_var = ${JSON.stringify(this.load_var)}`
          : ''
      }

      ${
        type_of(this.file) !== 'undefined'
          ? `step.file = ${JSON.stringify(this.file)}`
          : ''
      }

      ${
        type_of(this.format) !== 'undefined'
          ? `step.format = ${JSON.stringify(this.format)}`
          : ''
      }

      ${
        type_of(this.reveal) !== 'undefined'
          ? `step.reveal = ${this.reveal ?? 'undefined'}`
          : ''
      }
    })`
  }
}
