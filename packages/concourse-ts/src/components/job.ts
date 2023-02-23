import {Initer} from '../declarations/initialisable'
import * as Type from '../declarations/types'

import {Resource} from './resource'
import {AnyStep, DoStep, TaskStep} from './step'
import {Step} from './step/_base'

export class Job {
  private static customiser: Initer<Job>

  public static customise = (init: Initer<Job>) => {
    Job.customiser = init
  }

  constructor(public name: string, init?: Initer<Job>) {
    if (Job.customiser) {
      Job.customiser(this)
    }

    if (init) {
      init(this)
    }
  }

  private plan?: AnyStep[]

  public add_step = (...steps: AnyStep[]) => {
    if (!this.plan) this.plan = []

    this.plan.push(...steps)
  }

  public add_step_first = (...steps: AnyStep[]) => {
    if (!this.plan) this.plan = []

    this.plan.unshift(...steps)
  }

  public build_log_retention?: Type.BuildLogRetentionPolicy

  public disable_manual_trigger?: boolean

  public interruptible?: boolean

  public max_in_flight?: number

  public old_name?: string

  private on_success?: DoStep

  public add_on_success = (step: AnyStep) => {
    if (!this.on_success && step instanceof DoStep) {
      this.on_success = step
      return
    }

    if (!this.on_success)
      this.on_success = new DoStep(`${this.name}_on_success`)

    this.on_success.add_do(step)
  }

  private on_failure?: DoStep

  public add_on_failure = (step: AnyStep) => {
    if (!this.on_failure && step instanceof DoStep) {
      this.on_failure = step
      return
    }

    if (!this.on_failure)
      this.on_failure = new DoStep(`${this.name}_on_failure`)

    this.on_failure.add_do(step)
  }

  private on_error?: DoStep

  public add_on_error = (step: AnyStep) => {
    if (!this.on_error && step instanceof DoStep) {
      this.on_error = step
      return
    }

    if (!this.on_error) this.on_error = new DoStep(`${this.name}_on_error`)

    this.on_error.add_do(step)
  }

  private on_abort?: DoStep

  public add_on_abort = (step: AnyStep) => {
    if (!this.on_abort && step instanceof DoStep) {
      this.on_abort = step
      return
    }

    if (!this.on_abort) this.on_abort = new DoStep(`${this.name}_on_abort`)

    this.on_abort.add_do(step)
  }

  private ensure?: DoStep

  public add_ensure = (step: AnyStep) => {
    if (!this.ensure && step instanceof DoStep) {
      this.ensure = step
      return
    }

    if (!this.ensure) this.ensure = new DoStep(`${this.name}_ensure`)

    this.ensure.add_do(step)
  }

  public public = false

  public serial = false

  public serial_groups?: string

  private get_base_resources(): Resource[] {
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

  public get_resources = (): Resource[] => {
    const result = this.get_base_resources()

    this.plan.forEach((step) => {
      // Get and Put steps hold resources, so we extract those here.
      result.push(...step.get_resources())
    })

    return result
  }

  public get_task_steps = () => {
    const result: TaskStep[] = []

    this.plan?.forEach((step) => {
      if (step instanceof TaskStep) {
        result.push(step)
      }
    })

    return result
  }

  serialise() {
    const result: Type.Job = {
      name: this.name,
      plan: this.plan.map((s) => s.serialise()),
      build_log_retention: this.build_log_retention,

      // Deprecated, same as build_log_retention.builds
      build_logs_to_retain: undefined,
      disable_manual_trigger: this.disable_manual_trigger,
      ensure: this.ensure?.serialise(),
      interruptible: this.interruptible,
      max_in_flight: this.max_in_flight,
      old_name: this.old_name,
      on_abort: this.on_abort?.serialise(),
      on_error: this.on_error?.serialise(),
      on_failure: this.on_failure?.serialise(),
      on_success: this.on_success?.serialise(),
      public: this.public,
      serial: this.serial,
      serial_groups: this.serial_groups,
    }

    return result
  }

  public static deserialise(input: Type.Job, resourcePool: Resource[]) {
    return new Job(input.name, (job) => {
      job.plan = input.plan.map((step, index) =>
        Step.deserialise_any(`${input.name}_step_${index}`, resourcePool, step)
      )

      job.build_log_retention = input.build_log_retention

      // Upgrade deprecated config to non-deprecated format
      if (input.build_logs_to_retain && !job.build_log_retention.builds) {
        job.build_log_retention = {
          ...job.build_log_retention,
          builds: input.build_logs_to_retain,
        }
      }

      if (input.ensure) {
        job.ensure = Step.deserialise_prefer_do(
          `${job.name}_ensure`,
          resourcePool,
          input.ensure
        )
      }

      job.interruptible = input.interruptible
      job.max_in_flight = input.max_in_flight
      job.old_name = input.old_name

      if (input.on_abort) {
        job.on_abort = Step.deserialise_prefer_do(
          `${job.name}_on_abort`,
          resourcePool,
          input.on_abort
        )
      }

      if (input.on_error) {
        job.on_error = Step.deserialise_prefer_do(
          `${job.name}_on_error`,
          resourcePool,
          input.on_error
        )
      }

      if (input.on_failure) {
        job.on_failure = Step.deserialise_prefer_do(
          `${job.name}_on_failure`,
          resourcePool,
          input.on_failure
        )
      }

      if (input.on_success) {
        job.on_success = Step.deserialise_prefer_do(
          `${job.name}_on_success`,
          resourcePool,
          input.on_success
        )
      }

      job.public = input.public
      job.serial = input.serial
      job.serial_groups = input.serial_groups
    })
  }
}
