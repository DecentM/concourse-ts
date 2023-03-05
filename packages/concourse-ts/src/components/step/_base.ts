import {VError} from 'verror'
import * as Type from '../../declarations/types'

import {
  AnyStep,
  DoStep,
  GetStep,
  InParallelStep,
  LoadVarStep,
  PutStep,
  SetPipelineStep,
  TaskStep,
  TryStep,
} from '.'

import {Resource} from '../resource'

import {
  is_do_step,
  is_get_step,
  is_in_parallel_step,
  is_load_var_step,
  is_put_step,
  is_set_pipeline_step,
  is_task_step,
  is_try_step,
} from '../../utils/step-type'

import {Duration, DurationInput, get_duration} from '../../utils'
import {Customiser} from '../../declarations'

export abstract class Step<StepType extends Type.Step> {
  private static base_customiser: Customiser<Step<Type.Step>>

  /**
   * Customises the base of all Steps constructed after calling this function
   *
   * {@link Type.Customiser}
   *
   * @param {Customiser<AnyStep>} init
   */
  public static customise_base = (init: Customiser<AnyStep>) => {
    Step.base_customiser = init
  }

  constructor(public name: string) {
    if (Step.base_customiser) {
      Step.base_customiser(this)
    }
  }

  /**
   * @internal Used by the compiler
   */
  public abstract get_resources(): Resource[]

  private timeout: Duration

  /**
   * https://concourse-ci.org/timeout-step.html
   *
   * @param {DurationInput} timeout
   */
  public set_timeout = (timeout: DurationInput) => {
    this.timeout = get_duration(timeout)
  }

  /**
   * https://concourse-ci.org/attempts-step.html
   */
  public attempts: number

  protected tags: Type.Tags

  /**
   * @internal Used by the compiler
   *
   * @returns {Resource[]}
   */
  protected get_base_resources(): Resource[] {
    const result: Resource[] = []

    if (this.on_success) {
      result.push(...this.on_success.get_resources())
    }

    if (this.on_failure) {
      result.push(...this.on_failure.get_resources())
    }

    if (this.on_error) {
      result.push(...this.on_error.get_resources())
    }

    if (this.on_abort) {
      result.push(...this.on_abort.get_resources())
    }

    if (this.ensure) {
      result.push(...this.ensure.get_resources())
    }

    return result
  }

  /**
   * https://concourse-ci.org/tags-step.html
   *
   * @param {...string[]} tags
   */
  public add_tag = (...tags: string[]) => {
    if (!this.tags) this.tags = []

    this.tags.push(...tags)
  }

  protected on_success?: DoStep

  /**
   * Adds a step to be run after this one succeeds.
   *
   * https://concourse-ci.org/on-success-step.html
   *
   * @param {AnyStep} step
   */
  public add_on_success = (step: AnyStep) => {
    if (!this.on_success)
      this.on_success = new DoStep(`${this.name}_on_success`)

    this.on_success.add_do(step)
  }

  protected on_failure?: DoStep

  /**
   * Adds a step to be run after this one fails.
   *
   * https://concourse-ci.org/on-failure-hook.html
   *
   * @param {AnyStep} step
   */
  public add_on_failure = (step: AnyStep) => {
    if (!this.on_failure)
      this.on_failure = new DoStep(`${this.name}_on_failure`)

    this.on_failure.add_do(step)
  }

  protected on_error?: DoStep

  /**
   * Adds a step to be run after this one errors.
   *
   * https://concourse-ci.org/on-error-hook.html
   *
   * @param {AnyStep} step
   */
  public add_on_error = (step: AnyStep) => {
    if (!this.on_error) this.on_error = new DoStep(`${this.name}_on_error`)

    this.on_error.add_do(step)
  }

  protected on_abort?: DoStep

  /**
   * Adds a step to be run after this one is aborted.
   *
   * https://concourse-ci.org/on-abort-hook.html
   *
   * @param {AnyStep} step
   */
  public add_on_abort = (step: AnyStep) => {
    if (!this.on_abort) this.on_abort = new DoStep(`${this.name}_on_abort`)

    this.on_abort.add_do(step)
  }

  protected ensure?: DoStep

  /**
   * Adds a step to always be run after this one.
   *
   * https://concourse-ci.org/ensure-hook.html
   *
   * @param {AnyStep} step
   */
  public add_ensure = (step: AnyStep) => {
    if (!this.ensure) this.ensure = new DoStep(`${this.name}_ensure`)

    this.ensure.add_do(step)
  }

  /**
   * @internal Used by the compiler
   *
   * @returns {Type.StepBase}
   */
  protected serialise_base = () => {
    const result: Type.StepBase = {
      attempts: this.attempts,
      ensure: this.ensure?.serialise(),
      on_abort: this.on_abort?.serialise(),
      on_error: this.on_error?.serialise(),
      on_failure: this.on_failure?.serialise(),
      on_success: this.on_success?.serialise(),
      tags: this.tags,
      timeout: this.timeout,
    }

    return result
  }

  /**
   * @internal Used by the compiler
   */
  public abstract serialise(): StepType

  /**
   * @internal Used by the compiler
   *
   * Deserialises any kind of step into their proper class instances
   *
   * @param name
   * @param resource_pool
   * @param input
   * @returns {AnyStep}
   */
  public static deserialise_any(
    name: string,
    resource_pool: Resource[],
    input: Type.Step
  ) {
    if (is_do_step(input)) return DoStep.deserialise(name, resource_pool, input)

    if (is_get_step(input))
      return GetStep.deserialise(name, resource_pool, input)

    if (is_in_parallel_step(input))
      return InParallelStep.deserialise(name, resource_pool, input)

    if (is_load_var_step(input))
      return LoadVarStep.deserialise(name, resource_pool, input)

    if (is_put_step(input))
      return PutStep.deserialise(name, resource_pool, input)

    if (is_set_pipeline_step(input))
      return SetPipelineStep.deserialise(name, resource_pool, input)

    if (is_task_step(input))
      return TaskStep.deserialise(name, resource_pool, input)

    if (is_try_step(input))
      return TryStep.deserialise(name, resource_pool, input)

    throw new VError(
      `Cannot deserialise step "${name}" because its type cannot be recognised`
    )
  }

  /**
   * @internal Used by the compiler
   *
   * Deserialises any step into a DoStep. If input is already a DoStep, it does
   * not nest.
   *
   * @param name
   * @param resource_pool
   * @param input
   * @returns {DoStep}
   */
  public static deserialise_prefer_do(
    name: string,
    resource_pool: Resource[],
    input: Type.Step
  ): DoStep {
    if (is_do_step(input)) {
      return DoStep.deserialise(name, resource_pool, input)
    } else if (input) {
      return new DoStep(name, (doStep) => {
        doStep.add_do(
          Step.deserialise_any(`${doStep.name}_do`, resource_pool, input)
        )
      })
    }

    throw new VError(`Cannot deserialise step "${name}" because it's nullish`)
  }

  /**
   * @internal Used by the compiler
   *
   * @param step
   * @param resource_pool
   * @param input
   */
  protected static deserialise_base(
    step: AnyStep,
    resource_pool: Resource[],
    input: Type.Step
  ) {
    step.attempts = input.attempts

    step.tags = input.tags

    step.timeout = input.timeout

    if (is_do_step(input.ensure)) {
      step.ensure = DoStep.deserialise(
        `${step.name}_ensure`,
        resource_pool,
        input.ensure
      )
    }

    if (is_do_step(input.on_abort)) {
      step.on_abort = DoStep.deserialise(
        `${step.name}_on_abort`,
        resource_pool,
        input.on_abort
      )
    }

    if (is_do_step(input.on_error)) {
      step.on_error = DoStep.deserialise(
        `${step.name}_on_error`,
        resource_pool,
        input.on_error
      )
    }

    if (is_do_step(input.on_failure)) {
      step.on_error = DoStep.deserialise(
        `${step.name}_on_failure`,
        resource_pool,
        input.on_failure
      )
    }

    if (is_do_step(input.on_success)) {
      step.on_error = DoStep.deserialise(
        `${step.name}_on_success`,
        resource_pool,
        input.on_success
      )
    }
  }
}
