import {Initer} from '~/declarations/initialisable'
import * as Type from '~/declarations/types'

import {Step} from './_base'

export class InParallelStep extends Step<Type.InParallelStep> {
  constructor(init?: Initer<InParallelStep>) {
    super()

    if (init) {
      init(this)
    }
  }

  private steps: Step<Type.Step>[] = []

  public add_step = (step: Step<Type.Step>) => {
    this.steps.push(step)
  }

  public limit = 3

  public fail_fast = true

  public serialise() {
    const result: Type.InParallelStep = {
      ...this.serialise_base(),
      in_parallel: {
        steps: this.steps.map((s) => s.serialise()),
        fail_fast: this.fail_fast,
        limit: this.limit,
      },
    }

    return result
  }
}
