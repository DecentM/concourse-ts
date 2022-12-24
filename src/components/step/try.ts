import {VError} from 'verror'
import {Initer} from '~/declarations/initialisable'
import * as Type from '~/declarations/types'

import {Step} from './_base'

export class TryStep extends Step<Type.TryStep> {
  constructor(init?: Initer<TryStep>) {
    super()

    if (init) {
      init(this)
    }
  }

  private step?: Step<Type.Step>

  public set_try = (step: Step<Type.Step>) => {
    this.step = step
  }

  public serialise() {
    if (!this.step) {
      throw new VError(
        'Cannot serialise TryStep because "try" has not been set'
      )
    }

    const result: Type.TryStep = {
      ...this.serialise_base(),
      try: this.step.serialise(),
    }

    return result
  }
}
