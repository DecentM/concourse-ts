import {Initer} from '~/declarations/initialisable'
import {Serialisable} from '~/declarations/serialisable'
import * as Type from '~/declarations/types'
import {LogRetentionPolicyTenBuilds} from '~/defaults/log-retention-policies/ten-builds'

export class Job extends Serialisable<Type.Job> {
  constructor(private name: string, init?: Initer<Job>) {
    super()

    if (init) {
      init(this)
    }
  }

  private plan: Type.Step[] = []

  public add_step = (step: Type.Step) => {
    this.plan.push(step)
  }

  public build_log_retention = LogRetentionPolicyTenBuilds

  public disable_manual_trigger = false

  public ensure: Type.Step

  public interruptible = true

  public max_in_flight = 3

  public old_name: string | undefined

  public on_abort: Type.DoStep

  public on_error: Type.DoStep

  public on_failure: Type.DoStep

  public on_success: Type.DoStep

  public public = false

  public serial = false

  public serial_groups: string | undefined

  serialise() {
    const result: Type.Job = {
      name: this.name,
      plan: this.plan,
      build_log_retention: this.build_log_retention,

      // Deprecated, same as build_log_retention.builds
      build_logs_to_retain: undefined,
      disable_manual_trigger: this.disable_manual_trigger,
      ensure: this.ensure,
      interruptible: this.interruptible,
      max_in_flight: this.max_in_flight,
      old_name: this.old_name,
      on_abort: this.on_abort,
      on_error: this.on_error,
      on_failure: this.on_failure,
      on_success: this.on_success,
      public: this.public,
      serial: this.serial,
      serial_groups: this.serial_groups,
    }

    return result
  }
}
