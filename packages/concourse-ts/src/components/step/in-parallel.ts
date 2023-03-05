import {Customiser} from '../../declarations/customiser'
import * as Type from '../../declarations/types'
import {AnyStep} from '.'

import {Step} from './_base'
import {Resource} from '../resource'

export class InParallelStep extends Step<Type.InParallelStep> {
  private static customiser: Customiser<InParallelStep>

  public static customise = (init: Customiser<InParallelStep>) => {
    InParallelStep.customiser = init
  }

  constructor(
    public override name: string,
    customise?: Customiser<InParallelStep>
  ) {
    super(name)

    if (InParallelStep.customiser) {
      InParallelStep.customiser(this)
    }

    if (customise) {
      customise(this)
    }
  }

  private steps: AnyStep[]

  public add_step = (...steps: AnyStep[]) => {
    if (!this.steps) this.steps = []

    this.steps.push(...steps)
  }

  public limit: number

  public fail_fast: boolean

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
