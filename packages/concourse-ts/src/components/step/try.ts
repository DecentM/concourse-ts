import { Customiser } from '../../declarations/customiser.js'
import * as Type from '../../declarations/types.js'
import { Resource } from '../resource.js'

import { Step } from './base.js'

export class TryStep extends Step<Type.TryStep> {
  private static customiser: Customiser<TryStep>

  public static customise = (init: Customiser<TryStep>) => {
    TryStep.customiser = init
  }

  constructor(
    public override name: string,
    customise?: Customiser<TryStep>
  ) {
    super(name)

    if (TryStep.customiser) {
      TryStep.customiser(this)
    }

    if (customise) {
      customise(this)
    }
  }

  private step?: Step<Type.Step>

  public set_try = (step: Step<Type.Step>) => {
    this.step = step
  }

  /**
   * @internal Used by the compiler
   *
   * @returns {TaskStep[]}
   */
  public get_task_steps() {
    const result = this.get_base_task_steps()

    if (this.step) {
      result.push(...this.step.get_task_steps())
    }

    return result
  }

  public get_resources(): Resource[] {
    const result = this.get_base_resources()

    if (!this.step) {
      return result
    }

    result.push(...this.step.get_resources())

    return result
  }

  public serialise() {
    const result: Type.TryStep = {
      ...this.serialise_base(),
      try: this.step?.serialise(),
    }

    return result
  }
}
