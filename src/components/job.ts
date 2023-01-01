import {Initer} from '~/declarations/initialisable'
import {Serialisable} from '~/declarations/serialisable'
import * as Type from '~/declarations/types'
import {LogRetentionPolicyTenBuilds} from '~/defaults/log-retention-policies/ten-builds'

import {AnyStep, DoStep} from './step'

export class Job extends Serialisable<Type.Job> {
  constructor(public name: string, init?: Initer<Job>) {
    super()

    if (init) {
      init(this)
    }
  }

  private plan?: AnyStep[]

  public add_step = (...steps: AnyStep[]) => {
    if (!this.plan) this.plan = []

    this.plan.push(...steps)
  }

  public build_log_retention = LogRetentionPolicyTenBuilds

  public disable_manual_trigger = false

  public interruptible = true

  public max_in_flight = 3

  public old_name?: string

  private on_success?: DoStep

  public add_on_success = (step: AnyStep) => {
    if (!this.on_success)
      this.on_success = new DoStep(`${this.name}_on_success`)

    this.on_success.add_do(step)
  }

  private on_failure?: DoStep

  public add_on_failure = (step: AnyStep) => {
    if (!this.on_failure)
      this.on_failure = new DoStep(`${this.name}_on_failure`)

    this.on_failure.add_do(step)
  }

  private on_error?: DoStep

  public add_on_error = (step: AnyStep) => {
    if (!this.on_error) this.on_error = new DoStep(`${this.name}_on_error`)

    this.on_error.add_do(step)
  }

  private on_abort?: DoStep

  public add_on_abort = (step: AnyStep) => {
    if (!this.on_abort) this.on_abort = new DoStep(`${this.name}_on_abort`)

    this.on_abort.add_do(step)
  }

  private ensure?: DoStep

  public add_ensure = (step: AnyStep) => {
    if (!this.ensure) this.ensure = new DoStep(`${this.name}_ensure`)

    this.ensure.add_do(step)
  }

  public public = false

  public serial = false

  public serial_groups?: string

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
}
