import { Customiser } from '../../declarations/customiser'
import * as Type from '../../declarations/types'

import { Step } from './base'
import { Resource } from '../resource'
import { AnyStep } from '../../declarations'

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

  private steps: AnyStep[] = []

  public add_step = (...steps: AnyStep[]) => {
    this.steps.push(...steps)
  }

  public limit: number

  public fail_fast: boolean

  /**
   * @internal Used by the compiler
   */
  public get_task_steps() {
    const result = this.get_base_task_steps()

    this.steps.map((step) => {
      result.push(...step.get_task_steps())
    })

    return result
  }

  /**
   * @internal Used by the compiler
   */
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
