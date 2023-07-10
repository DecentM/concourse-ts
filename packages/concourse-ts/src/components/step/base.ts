import * as Type from '../../declarations/types'

import {Resource} from '../resource'

import {Customiser} from '../../declarations'
import {Duration, DurationInput, get_duration} from '../../utils/duration'
import {AnyStep} from '../../declarations/any-step'

import {TaskStep} from './task'
import {DoStep as DoStepComponent} from './do'

/**
 * Ugly hack to trick the compiler into not writing `require('./do')` into the
 * top level of the output. Otherwise, DoStep construction fails because it
 * happens before this base class is defined, resulting in a hard to debug
 * error.
 *
 * @internal
 *
 * @param {string} name
 * @returns {DoStep}
 */
const create_do_step = (name: string) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const {DoStep}: {DoStep: typeof DoStepComponent} = require('./do')

  return new DoStep(name)
}

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

  private across: Type.Across[] = []

  /**
   * https://concourse-ci.org/across-step.html
   *
   * @param {Across} across The modifier to add
   */
  public add_across = (...across: Type.Across[]) => {
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

  /**
   * https://concourse-ci.org/attempts-step.html
   */
  public attempts: number

  protected tags: Type.Tags = []

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
   * @internal Used by the compiler
   *
   * @returns {TaskStep[]}
   */
  protected get_base_task_steps(): TaskStep[] {
    const result: TaskStep[] = []

    if (this.on_success) {
      result.push(...this.on_success.get_task_steps())
    }

    if (this.on_failure) {
      result.push(...this.on_failure.get_task_steps())
    }

    if (this.on_error) {
      result.push(...this.on_error.get_task_steps())
    }

    if (this.on_abort) {
      result.push(...this.on_abort.get_task_steps())
    }

    if (this.ensure) {
      result.push(...this.ensure.get_task_steps())
    }

    return result
  }

  /**
   * https://concourse-ci.org/tags-step.html
   *
   * @param {...string[]} tags
   */
  public add_tag = (...tags: string[]) => {
    this.tags.push(...tags)
  }

  protected on_success?: DoStepComponent

  /**
   * Adds a step to be run after this one succeeds.
   *
   * https://concourse-ci.org/on-success-step.html
   *
   * @param {AnyStep} step
   */
  public add_on_success = (step: AnyStep) => {
    if (!this.on_success)
      this.on_success = create_do_step(`${this.name}_on_success`)

    this.on_success.add_step(step)
  }

  protected on_failure?: DoStepComponent

  /**
   * Adds a step to be run after this one fails.
   *
   * https://concourse-ci.org/on-failure-hook.html
   *
   * @param {AnyStep} step
   */
  public add_on_failure = (step: AnyStep) => {
    if (!this.on_failure)
      this.on_failure = create_do_step(`${this.name}_on_failure`)

    this.on_failure.add_step(step)
  }

  protected on_error?: DoStepComponent

  /**
   * Adds a step to be run after this one errors.
   *
   * https://concourse-ci.org/on-error-hook.html
   *
   * @param {AnyStep} step
   */
  public add_on_error = (step: AnyStep) => {
    if (!this.on_error) this.on_error = create_do_step(`${this.name}_on_error`)

    this.on_error.add_step(step)
  }

  protected on_abort?: DoStepComponent

  /**
   * Adds a step to be run after this one is aborted.
   *
   * https://concourse-ci.org/on-abort-hook.html
   *
   * @param {AnyStep} step
   */
  public add_on_abort = (step: AnyStep) => {
    if (!this.on_abort) this.on_abort = create_do_step(`${this.name}_on_abort`)

    this.on_abort.add_step(step)
  }

  protected ensure?: DoStepComponent

  /**
   * Adds a step to always be run after this one.
   *
   * https://concourse-ci.org/ensure-hook.html
   *
   * @param {AnyStep} step
   */
  public add_ensure = (step: AnyStep) => {
    if (!this.ensure) this.ensure = create_do_step(`${this.name}_ensure`)

    this.ensure.add_step(step)
  }

  /**
   * @internal Used by the compiler
   *
   * @returns {Type.StepBase}
   */
  protected serialise_base = (): Type.StepBase => {
    return {
      attempts: this.attempts,
      ensure: this.ensure?.serialise(),
      on_abort: this.on_abort?.serialise(),
      on_error: this.on_error?.serialise(),
      on_failure: this.on_failure?.serialise(),
      on_success: this.on_success?.serialise(),
      tags: this.tags.length === 0 ? undefined : this.tags,
      timeout: this.timeout,
      across: this.across.length === 0 ? undefined : this.across,
    }
  }

  /**
   * @internal Used by the compiler
   */
  public abstract serialise(): StepType
}
