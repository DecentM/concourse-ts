import { Customiser } from '../../declarations/customiser.js'
import * as Type from '../../declarations/types.js'
import { Resource } from '../resource.js'

import { Step } from './base.js'

/**
 * Wraps a step to catch any failures and continue the build. If the wrapped
 * step fails, the try step succeeds and subsequent steps will run.
 *
 * https://concourse-ci.org/docs/steps/try/
 */
export class TryStep extends Step<Type.TryStep> {
  private static customiser: Customiser<TryStep>

  /**
   * Customises all TrySteps constructed after calling this function.
   *
   * {@link Type.Customiser}
   *
   * @param {Customiser<TryStep>} init
   */
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

  /**
   * Sets the step to attempt. If this step fails, the try step will succeed
   * and execution will continue.
   *
   * https://concourse-ci.org/docs/steps/try/
   *
   * @param {Step<Type.Step>} step The step to wrap in try
   */
  public set_try = (step: Step<Type.Step>) => {
    this.step = step
  }

  /**
   * @internal Used by the compiler
   */
  public get_task_steps() {
    const result = this.get_base_task_steps()

    if (this.step) {
      result.push(...this.step.get_task_steps())
    }

    return result
  }

  /**
   * @internal Used by the compiler
   */
  public get_resources(): Resource[] {
    const result = this.get_base_resources()

    if (!this.step) {
      return result
    }

    result.push(...this.step.get_resources())

    return result
  }

  /**
   * @internal Used by the compiler
   *
   * @returns {Type.TryStep} The serialised try step configuration
   */
  public serialise() {
    const result: Type.TryStep = {
      ...this.serialise_base(),
      try: this.step?.serialise(),
    }

    return result
  }
}
