import * as ConcourseTs from '@decentm/concourse-ts'

import { StepBuilder } from './step'
import { GetStepBuilder } from './steps/get'

export class JobBuilder {
  public build(): ConcourseTs.Job {
    const job = new ConcourseTs.Job(this._name)

    this._customisers.forEach((customise) => {
      const step_builder = new StepBuilder()
      customise(step_builder)

      job.add_step(step_builder.build())
    })

    this._passed.forEach((customise) => {
      const step_builder = new GetStepBuilder()
      customise(step_builder)

      const step = step_builder.build()
      step.add_passed(job)

      job.add_step(step)
    })

    return job
  }

  private _name: string

  public name(name: string): JobBuilder {
    this._name = name

    return this
  }

  private _customisers: ConcourseTs.Type.Customiser<StepBuilder>[] = []

  public step(customise: ConcourseTs.Type.Customiser<StepBuilder>): JobBuilder {
    this._customisers.push(customise)

    return this
  }

  private _passed: ConcourseTs.Type.Customiser<GetStepBuilder>[] = []

  public passed(customise: ConcourseTs.Type.Customiser<GetStepBuilder>): JobBuilder {
    this._passed.push(customise)

    return this
  }
}
