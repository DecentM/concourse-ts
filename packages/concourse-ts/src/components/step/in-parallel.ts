import {Initer} from '../../declarations/initialisable'
import * as Type from '../../declarations/types'
import {AnyStep} from '.'

import {Step} from './_base'
import {Resource} from '../resource'

export class InParallelStep extends Step<Type.InParallelStep> {
  constructor(public override name: string, init?: Initer<InParallelStep>) {
    super(name)

    if (init) {
      init(this)
    }
  }

  private steps: AnyStep[]

  public add_step = (...steps: AnyStep[]) => {
    if (!this.steps) this.steps = []

    this.steps.push(...steps)
  }

  public limit = 3

  public fail_fast = true

  public get_resources(): Resource[] {
    const result = this.get_base_resources()

    this.steps.forEach((step) => {
      result.push(...step.get_resources())
    })

    return result
  }

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
