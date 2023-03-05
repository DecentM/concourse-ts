import {VError} from 'verror'

import {Customiser} from '../../declarations/customiser'
import * as Type from '../../declarations/types'
import {log} from '../../utils/log'
import {Resource} from '../resource'

import {Step} from './_base'

export class TryStep extends Step<Type.TryStep> {
  private static customiser: Customiser<TryStep>

  public static customise = (init: Customiser<TryStep>) => {
    TryStep.customiser = init
  }

  constructor(public override name: string, customise?: Customiser<TryStep>) {
    super(name)

    if (TryStep.customiser) {
      TryStep.customiser(this)
    }

    if (customise) {
      customise(this)
    }
  }

  private step?: Step<Type.Step>

  public set_try = (step: Step<Type.Step>) => {
    this.step = step
  }

  public get_resources(): Resource[] {
    const result = this.get_base_resources()

    if (!this.step) {
      return result
    }

    result.push(...this.step.get_resources())

    return result
  }

  public serialise() {
    if (!this.step) {
      throw new VError(
        'Cannot serialise TryStep because "try" has not been set'
      )
    }

    if (!this.on_error) {
      log.warn`No error handler has been set in ${this.name} (TryStep). Errors during this step will be ignored. Set on_error to handle step errors.`
    }

    if (!this.ensure) {
      log.warn`No ensure step has been set in ${
        this.name
      } (TryStep). ${'ensure'} equals to the ${'finally'} block in a try/catch/finally, and allows you to clean up after a step, regardless of its outcome.`
    }

    const result: Type.TryStep = {
      ...this.serialise_base(),
      try: this.step.serialise(),
    }

    return result
  }

  public static deserialise(
    name: string,
    resourcePool: Resource[],
    input: Type.TryStep
  ) {
    return new TryStep(name, (step) => {
      this.deserialise_base(step, resourcePool, input)

      step.step = super.deserialise_any(`${name}_try`, resourcePool, input.try)
    })
  }
}
