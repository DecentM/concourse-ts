import * as Type from '../../declarations/types.js'

import { Resource } from '../resource.js'

import { Customiser } from '../../declarations/index.js'
import { Duration, DurationInput, get_duration } from '../../utils/duration/index.js'
import { AnyStep } from '../../declarations/any-step.js'

import { TaskStep } from './task.js'

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
  public abstract get_task_steps(): TaskStep[]

  /**
   * @internal Used by the compiler
   */
  public abstract get_resources(): Resource[]

  private timeout: Duration

  private across: Type.Across[]

  /**
   * https://concourse-ci.org/across-step.html
   *
   * @param {Across} across The modifier to add
   */
  public add_across = (...across: Type.Across[]) => {
    if (!this.across) this.across = []

    this.across.push(...across)
  }

  /**
   * https://concourse-ci.org/timeout-step.html
   *
   * @param {DurationInput} timeout
   */
  public set_timeout = (timeout: DurationInput) => {
    this.timeout = get_duration(timeout)
  }

  private attempts: number

  /**
   * Sets the number of attempts for this step.
   *
   * https://concourse-ci.org/attempts-step.html
   *
   * @param {number} attempts
   */
  public set_attempts = (attempts: number) => {
    this.attempts = attempts
  }

  protected tags: Type.Tags

  /**
   * @internal Used by the compiler
   *
   * @returns {Resource[]}
   */
  protected get_base_resources(): Resource[] {
    const result: Resource[] = []

    if (this.on_success) {
      for (const resources of this.on_success.map((s) => s.get_resources())) {
        result.push(...resources)
      }
    }

    if (this.on_failure) {
      for (const resources of this.on_failure.map((s) => s.get_resources())) {
        result.push(...resources)
      }
    }

    if (this.on_error) {
      for (const resources of this.on_error.map((s) => s.get_resources())) {
        result.push(...resources)
      }
    }

    if (this.on_abort) {
      for (const resources of this.on_abort.map((s) => s.get_resources())) {
        result.push(...resources)
      }
    }

    if (this.ensure) {
      for (const resources of this.ensure.map((s) => s.get_resources())) {
        result.push(...resources)
      }
    }

    return result
  }

  /**
   * @internal Used by the compiler
   *
   * @returns {TaskStep[]}
   */
  protected get_base_task_steps(): TaskStep[] {
    const result: TaskStep[] = []

    if (this.on_success) {
      for (const steps of this.on_success.map((s) => s.get_task_steps())) {
        result.push(...steps)
      }
    }

    if (this.on_failure) {
      for (const steps of this.on_failure.map((s) => s.get_task_steps())) {
        result.push(...steps)
      }
    }

    if (this.on_error) {
      for (const steps of this.on_error.map((s) => s.get_task_steps())) {
        result.push(...steps)
      }
    }

    if (this.on_abort) {
      for (const steps of this.on_abort.map((s) => s.get_task_steps())) {
        result.push(...steps)
      }
    }

    if (this.ensure) {
      for (const steps of this.ensure.map((s) => s.get_task_steps())) {
        result.push(...steps)
      }
    }

    return result
  }

  /**
   * https://concourse-ci.org/tags-step.html
   *
   * @param {...string[]} tags
   */
  public add_tags = (...tags: string[]) => {
    if (!this.tags) this.tags = []

    this.tags.push(...tags)
  }

  protected on_success?: AnyStep[]

  /**
   * Adds a step to be run after this one succeeds.
   *
   * https://concourse-ci.org/on-success-step.html
   *
   * @param {AnyStep} step
   */
  public add_on_success = (step: AnyStep) => {
    if (!this.on_success) this.on_success = [] // this.on_success = new DoStep(`${this.name}_on_success`)

    this.on_success.push(step)
  }

  protected on_failure?: AnyStep[]

  /**
   * Adds a step to be run after this one fails.
   *
   * https://concourse-ci.org/on-failure-hook.html
   *
   * @param {AnyStep} step
   */
  public add_on_failure = (step: AnyStep) => {
    if (!this.on_failure) this.on_failure = [] // this.on_failure = new DoStep(`${this.name}_on_failure`)

    this.on_failure.push(step)
  }

  protected on_error?: AnyStep[]

  /**
   * Adds a step to be run after this one errors.
   *
   * https://concourse-ci.org/on-error-hook.html
   *
   * @param {AnyStep} step
   */
  public add_on_error = (step: AnyStep) => {
    if (!this.on_error) this.on_error = [] // this.on_error = new DoStep(`${this.name}_on_error`)

    this.on_error.push(step)
  }

  protected on_abort?: AnyStep[]

  /**
   * Adds a step to be run after this one is aborted.
   *
   * https://concourse-ci.org/on-abort-hook.html
   *
   * @param {AnyStep} step
   */
  public add_on_abort = (step: AnyStep) => {
    if (!this.on_abort) this.on_abort = [] // this.on_abort = new DoStep(`${this.name}_on_abort`)

    this.on_abort.push(step)
  }

  protected ensure?: AnyStep[]

  /**
   * Adds a step to always be run after this one.
   *
   * https://concourse-ci.org/ensure-hook.html
   *
   * @param {AnyStep} step
   */
  public add_ensure = (step: AnyStep) => {
    if (!this.ensure) this.ensure = [] // this.ensure = new DoStep(`${this.name}_ensure`)

    this.ensure.push(step)
  }

  /**
   * @internal Used by the compiler
   *
   * @returns {Type.StepBase}
   */
  protected serialise_base = (): Type.StepBase => {
    return {
      attempts: this.attempts,
      ensure: this.ensure
        ? { do: this.ensure.map((s) => s.serialise()) }
        : undefined,
      on_abort: this.on_abort
        ? { do: this.on_abort.map((s) => s.serialise()) }
        : undefined,
      on_error: this.on_error
        ? { do: this.on_error.map((s) => s.serialise()) }
        : undefined,
      on_failure: this.on_failure
        ? { do: this.on_failure.map((s) => s.serialise()) }
        : undefined,
      on_success: this.on_success
        ? { do: this.on_success.map((s) => s.serialise()) }
        : undefined,
      tags: this.tags,
      timeout: this.timeout,
      across: this.across,
    }
  }

  public abstract serialise(): StepType
}
