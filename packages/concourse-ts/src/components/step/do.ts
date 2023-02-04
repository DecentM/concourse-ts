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

  private do: AnyStep[]

  public add_do = (step: AnyStep) => {
    if (!this.do) this.do = []

    this.do.push(step)
  }

  public add_do_first = (step: AnyStep) => {
    if (!this.do) this.do = []

    this.do.unshift(step)
  }

  public get_resources(): Resource[] {
    const result = this.get_base_resources()

    this.do.forEach((step) => {
      result.push(...step.get_resources())
    })

    return result
  }

  public serialise() {
    const result: Type.DoStep = {
      ...this.serialise_base(),
      do: this.do.map((s) => s.serialise()),
    }

    return result
  }

  public static deserialise(
    name: string,
    resourcePool: Resource[],
    input: Type.DoStep
  ) {
    return new DoStep(name, (step) => {
      this.deserialise_base(step, input)

      step.do = input.do.map((planStep, index) => {
        return super.deserialise_any(
          `${name}_plan_${index}`,
          resourcePool,
          planStep
        )
      })
    })
  }
}
