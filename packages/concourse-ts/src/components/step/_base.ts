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
} from '../../utils/step-type/get-step-type'

import {Duration, DurationInput, get_duration} from '../../utils'
import {Initer} from '../../declarations'

export abstract class Step<StepType extends Type.Step> {
  private static base_customiser: Initer<Step<Type.Step>>

  public static customise_base = (init: Initer<Step<Type.Step>>) => {
    Step.base_customiser = init
  }

  constructor(public name: string) {
    if (Step.base_customiser) {
      Step.base_customiser(this)
    }
  }

  public abstract get_resources(): Resource[]

  private timeout: Duration

  public set_timeout = (timeout: DurationInput) => {
    this.timeout = get_duration(timeout)
  }

  public attempts: number

  protected tags: Type.Tags

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

  public add_tag = (...tags: string[]) => {
    if (!this.tags) this.tags = []

    this.tags.push(...tags)
  }

  protected on_success?: DoStep

  public add_on_success = (step: AnyStep) => {
    if (!this.on_success)
      this.on_success = new DoStep(`${this.name}_on_success`)

    this.on_success.add_do(step)
  }

  protected on_failure?: DoStep

  public add_on_failure = (step: AnyStep) => {
    if (!this.on_failure)
      this.on_failure = new DoStep(`${this.name}_on_failure`)

    this.on_failure.add_do(step)
  }

  protected on_error?: DoStep

  public add_on_error = (step: AnyStep) => {
    if (!this.on_error) this.on_error = new DoStep(`${this.name}_on_error`)

    this.on_error.add_do(step)
  }

  protected on_abort?: DoStep

  public add_on_abort = (step: AnyStep) => {
    if (!this.on_abort) this.on_abort = new DoStep(`${this.name}_on_abort`)

    this.on_abort.add_do(step)
  }

  protected ensure?: DoStep

  public add_ensure = (step: AnyStep) => {
    if (!this.ensure) this.ensure = new DoStep(`${this.name}_ensure`)

    this.ensure.add_do(step)
  }

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

  public abstract serialise(): StepType

  public static deserialise_any(
    name: string,
    resourcePool: Resource[],
    input: Type.Step
  ) {
    if (is_do_step(input)) return DoStep.deserialise(name, resourcePool, input)

    if (is_get_step(input))
      return GetStep.deserialise(name, resourcePool, input)

    if (is_in_parallel_step(input))
      return InParallelStep.deserialise(name, resourcePool, input)

    if (is_load_var_step(input))
      return LoadVarStep.deserialise(name, resourcePool, input)

    if (is_put_step(input))
      return PutStep.deserialise(name, resourcePool, input)

    if (is_set_pipeline_step(input))
      return SetPipelineStep.deserialise(name, resourcePool, input)

    if (is_task_step(input))
      return TaskStep.deserialise(name, resourcePool, input)

    if (is_try_step(input))
      return TryStep.deserialise(name, resourcePool, input)

    throw new VError(
      `Cannot deserialise step "${name}" because its type cannot be recognised`
    )
  }

  public static deserialise_prefer_do(
    name: string,
    resourcePool: Resource[],
    input: Type.Step
  ): DoStep {
    if (is_do_step(input)) {
      return DoStep.deserialise(name, resourcePool, input)
    } else if (input) {
      return new DoStep(name, (doStep) => {
        doStep.add_do(
          Step.deserialise_any(`${doStep.name}_do`, resourcePool, input)
        )
      })
    }

    throw new VError(`Cannot deserialise step "${name}" because it's nullish`)
  }

  protected static deserialise_base(
    step: AnyStep,
    resourcePool: Resource[],
    input: Type.Step
  ) {
    step.attempts = input.attempts

    step.tags = input.tags

    step.timeout = input.timeout

    if (is_do_step(input.ensure)) {
      step.ensure = DoStep.deserialise(
        `${step.name}_ensure`,
        resourcePool,
        input.ensure
      )
    }

    if (is_do_step(input.on_abort)) {
      step.on_abort = DoStep.deserialise(
        `${step.name}_on_abort`,
        resourcePool,
        input.on_abort
      )
    }

    if (is_do_step(input.on_error)) {
      step.on_error = DoStep.deserialise(
        `${step.name}_on_error`,
        resourcePool,
        input.on_error
      )
    }

    if (is_do_step(input.on_failure)) {
      step.on_error = DoStep.deserialise(
        `${step.name}_on_failure`,
        resourcePool,
        input.on_failure
      )
    }

    if (is_do_step(input.on_success)) {
      step.on_error = DoStep.deserialise(
        `${step.name}_on_success`,
        resourcePool,
        input.on_success
      )
    }
  }
}
