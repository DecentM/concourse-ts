import {Initer} from '~/declarations/initialisable'
import {Serialisable} from '~/declarations/serialisable'
import * as Type from '~/declarations/types'
import {LogRetentionPolicyTenBuilds} from '~/defaults/log-retention-policies/ten-builds'
import {AnyStep} from './step'

export class Job extends Serialisable<Type.Job> {
  constructor(public name: string, init?: Initer<Job>) {
    super()

    if (init) {
      init(this)
    }
  }

  private plan?: AnyStep[]

  public add_step = (step: AnyStep) => {
    if (!this.plan) this.plan = []

    this.plan.push(step)
  }

  public build_log_retention = LogRetentionPolicyTenBuilds

  public disable_manual_trigger = false

  public ensure?: AnyStep

  public interruptible = true

  public max_in_flight = 3

  public old_name?: string

  public on_abort?: AnyStep

  public on_error?: AnyStep

  public on_failure?: AnyStep

  public on_success?: AnyStep

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
