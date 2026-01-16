import { Customiser } from '../../declarations/customiser.js'
import * as Type from '../../declarations/types.js'

import { Step } from './base.js'
import { Resource } from '../resource.js'
import { AnyStep } from '../../declarations/index.js'

/**
 * Performs steps in parallel. This step is useful for running multiple
 * independent operations concurrently to reduce overall build time.
 *
 * https://concourse-ci.org/docs/steps/in-parallel/
 */
export class InParallelStep extends Step<Type.InParallelStep> {
  private static customiser: Customiser<InParallelStep>

  /**
   * Customises all InParallelSteps constructed after calling this function.
   *
   * {@link Type.Customiser}
   *
   * @param {Customiser<InParallelStep>} init
   */
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

  /**
   * Adds steps to be executed in parallel.
   *
   * https://concourse-ci.org/docs/steps/in-parallel/#in_parallel_config-schema
   *
   * @param {...AnyStep[]} steps The steps to execute in parallel
   */
  public add_steps = (...steps: AnyStep[]) => {
    this.steps.push(...steps)
  }

  private limit: number

  /**
   * Sets the maximum number of steps to run at a time. By default all steps
   * are run at once.
   *
   * https://concourse-ci.org/docs/steps/in-parallel/#in_parallel_config-schema
   *
   * @param {number} limit Maximum parallel steps
   */
  public set_limit(limit: number) {
    this.limit = limit
  }

  private fail_fast: boolean

  /**
   * Sets "fail_fast" to true - avoid calling to keep false
   *
   * https://concourse-ci.org/docs/steps/in-parallel/#in_parallel_config-schema
   */
  public set_fail_fast() {
    this.fail_fast = true
  }

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

  /**
   * @internal Used by the compiler
   *
   * @returns {Type.InParallelStep} The serialised in_parallel step configuration
   */
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
