import * as ConcourseTs from '@decentm/concourse-ts'

import { StepBuilderBase } from './base.js'
import { StepBuilder } from '../step.js'

export class InParallelStepBuilder extends StepBuilderBase<ConcourseTs.InParallelStep> {
  public override build(): ConcourseTs.InParallelStep {
    const step = new ConcourseTs.InParallelStep(this._name)

    this._customisers.forEach((customise) => {
      const step_builder = new StepBuilder()
      customise(step_builder)

      step.add_step(step_builder.build())
    })

    if (this._limit) step.limit = this._limit
    if (this._fail_fast) step.fail_fast = this._fail_fast

    return step
  }

  private _customisers: ConcourseTs.Type.Customiser<StepBuilder>[] = []

  public in_parallel(
    customise: ConcourseTs.Type.Customiser<StepBuilder>
  ): InParallelStepBuilder {
    this._customisers.push(customise)

    return this
  }

  private _limit: number

  public limit(limit: number): InParallelStepBuilder {
    this._limit = limit

    return this
  }

  private _fail_fast: boolean

  public fail_fast(): InParallelStepBuilder {
    this._fail_fast = true

    return this
  }
}
