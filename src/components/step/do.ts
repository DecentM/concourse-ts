import {Initer} from '~/declarations/initialisable'
import * as Type from '~/declarations/types'

import {Step} from './_base'

export class DoStep extends Step<Type.DoStep> {
  constructor(init?: Initer<DoStep>) {
    super()

    if (init) {
      init(this)
    }
  }

  private steps: Step<Type.Step>[] = []

  public add_do = (step: Step<Type.Step>) => {
    this.steps.push(step)
  }

  public serialise() {
    const result: Type.DoStep = {
      ...this.serialise_base(),
      do: this.steps.map((s) => s.serialise()),
    }

    return result
  }
}
