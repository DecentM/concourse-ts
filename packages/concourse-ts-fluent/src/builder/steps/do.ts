import * as ConcourseTs from '@decentm/concourse-ts'

import { StepBuilder } from '../step'
import { StepBuilderBase } from './base'
import { VError } from 'verror'

export class DoStepBuilder extends StepBuilderBase<ConcourseTs.DoStep> {
  public override build(): ConcourseTs.DoStep {
    if (!this._name) {
      throw new VError('Cannot build do step without a name')
    }

    const step = new ConcourseTs.DoStep(this._name)

    this._customisers.forEach((customise) => {
      const step_builder = new StepBuilder()
      customise(step_builder)

      step.add_step(step_builder.build())
    })

    return step
  }

  private _customisers: ConcourseTs.Type.Customiser<StepBuilder>[] = []

  public do(customise: ConcourseTs.Type.Customiser<StepBuilder>): DoStepBuilder {
    this._customisers.push(customise)

    return this
  }
}
