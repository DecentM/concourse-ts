import {Customiser} from '../../declarations/customiser'
import * as Type from '../../declarations/types'
import {AnyStep} from '.'

import {Step} from './_base'
import {Resource} from '../resource'

export class DoStep extends Step<Type.DoStep> {
  private static customiser: Customiser<DoStep>

  public static customise = (init: Customiser<DoStep>) => {
    DoStep.customiser = init
  }

  constructor(public override name: string, customise?: Customiser<DoStep>) {
    super(name)

    if (DoStep.customiser) {
      DoStep.customiser(this)
    }

    if (customise) {
      customise(this)
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
      super.deserialise_base(step, resourcePool, input)

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
