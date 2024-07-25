import { Customiser } from '../../declarations/customiser.js'
import * as Type from '../../declarations/types.js'
import { AnyStep } from '../../declarations/index.js'

import { Resource } from '../resource.js'

import { TaskStep } from './task.js'
import { Step } from './base.js'

/**
 * https://concourse-ci.org/do-step.html
 */
export class DoStep extends Step<Type.DoStep> {
  private static customiser: Customiser<DoStep>

  /**
   * Customises all DoSteps constructed after calling this function
   *
   * {@link Type.Customiser}
   *
   * @param {Customiser<DoStep>} init
   */
  public static customise = (init: Customiser<DoStep>) => {
    DoStep.customiser = init
  }

  constructor(
    public override name: string,
    customise?: Customiser<DoStep>
  ) {
    super(name)

    if (DoStep.customiser) {
      DoStep.customiser(this)
    }

    if (customise) {
      customise(this)
    }
  }

  private do: AnyStep[] = []

  /**
   * Adds a step after existing steps into this DoStep
   *
   * @param {AnyStep} step
   */
  public add_step = (step: AnyStep) => {
    this.do.push(step)
  }

  /**
   * Adds a step that runs before all existing steps in this DoStep
   *
   * @param {AnyStep} step
   */
  public add_step_first = (step: AnyStep) => {
    this.do.unshift(step)
  }

  /**
   * @internal Used by the compiler
   *
   * @returns {Resource[]}
   */
  public get_resources(): Resource[] {
    const result = this.get_base_resources()

    this.do.forEach((step) => {
      result.push(...step.get_resources())
    })

    return result
  }

  /**
   * @internal Used by the compiler
   *
   * @returns {TaskStep[]}
   */
  public get_task_steps(): TaskStep[] {
    const result = this.get_base_task_steps()

    this.do.forEach((step) => {
      result.push(...step.get_task_steps())
    })

    return result
  }

  /**
   * @internal Used by the compiler
   *
   * @returns {Type.DoStep}
   */
  public serialise() {
    const result: Type.DoStep = {
      ...this.serialise_base(),
      do: this.do.map((s) => s.serialise()),
    }

    return result
  }
}
