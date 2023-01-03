import {VError} from 'verror'

import {Initer} from '../../declarations/initialisable'
import * as Type from '../../declarations/types'
import {log} from '../../utils/log'

import {Step} from './_base'

export class TryStep extends Step<Type.TryStep> {
  constructor(public name: string, init?: Initer<TryStep>) {
    super(name)

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

    if (!this.on_error) {
      log.warn`No error handler has been set in ${this.name} (TryStep). Errors during this step will be ignored. Set on_error to handle step errors.`
    }

    if (!this.ensure) {
      log.warn`No ensure step has been set in ${
        this.name
      } (TryStep). ${'ensure'} equals to the ${'finally'} block in a try/catch/finally, and allows you to clean up after a step, regardless of its outcome.`
    }

    const result: Type.TryStep = {
      ...this.serialise_base(),
      try: this.step.serialise(),
    }

    return result
  }
}
