import * as ConcourseTs from '@decentm/concourse-ts'

import { StepBuilder } from '../step.js'
import { StepBuilderBase } from './base.js'

export class TryStepBuilder extends StepBuilderBase<ConcourseTs.TryStep> {
  public override build(): ConcourseTs.TryStep {
    const step = new ConcourseTs.TryStep(this._name)

    if (this._customise) {
      const step_builder = new StepBuilder()
      this._customise(step_builder)

      step.set_try(step_builder.build())
    }

    return step
  }

  private _customise: ConcourseTs.Type.Customiser<StepBuilder>

  public try(customise: ConcourseTs.Type.Customiser<StepBuilder>): TryStepBuilder {
    this._customise = customise

    return this
  }
}
