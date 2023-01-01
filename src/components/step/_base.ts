import {Initer} from '~/declarations/initialisable'
import {Serialisable} from '~/declarations/serialisable'
import * as Type from '~/declarations/types'
import {SixHours} from '~/defaults/durations/six-hours'
import {AnyStep, DoStep} from '.'
import {TryStep} from './try'

export abstract class Step<
  StepType extends Type.Step
> extends Serialisable<StepType> {
  constructor(public name: string) {
    super()
  }

  public timeout: Type.Duration = SixHours

  public attempts: number = 3

  protected tags: Type.Tags

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
}
