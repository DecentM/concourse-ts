import * as Type from '../../declarations/types'

import {AnyStep, DoStep} from '.'

import {Resource} from '../resource'

import {Customiser} from '../../declarations'
import {Duration, DurationInput, get_duration} from '../../utils/duration'

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
}
