import {Initer} from '../../declarations/initialisable'
import * as Type from '../../declarations/types'
import {AnyStep} from '.'

import {Step} from './_base'
import {Resource} from '../resource'

export class DoStep extends Step<Type.DoStep> {
  constructor(public override name: string, init?: Initer<DoStep>) {
    super(name)

    if (init) {
      init(this)
    }
  }

  private steps: AnyStep[]

  public add_do = (step: AnyStep) => {
    if (!this.steps) this.steps = []

    this.steps.push(step)
  }

  public get_resources(): Resource[] {
    const result = this.get_base_resources()

    this.steps.forEach((step) => {
      result.push(...step.get_resources())
    })

    return result
  }

  public serialise() {
    const result: Type.DoStep = {
      ...this.serialise_base(),
      do: this.steps.map((s) => s.serialise()),
    }

    return result
  }
}
