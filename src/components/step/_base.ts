import {Initer} from '~/declarations/initialisable'
import {Serialisable} from '~/declarations/serialisable'
import * as Type from '~/declarations/types'
import {SixHours} from '~/defaults/durations/six-hours'

export abstract class Step<StepType> extends Serialisable<StepType> {
  public timeout: Type.Duration = SixHours

  public attempts: number = 3

  protected tags: Type.Tags = []

  public add_tag = (tag: string) => {
    this.tags.push(tag)
  }

  public on_success?: Step<Type.Step>

  public on_failure?: Step<Type.Step>

  public on_error?: Step<Type.Step>

  public on_abort?: Step<Type.Step>

  public ensure?: Step<Type.Step>

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
}
