import * as ConcourseTs from '@decentm/concourse-ts'
import VError from 'verror'

import { GroupBuilder } from './group'
import { JobBuilder } from './job'

export class PipelineBuilder {
  public build() {
    if (!this._name) {
      throw new VError('Cannot build pipeline without a name')
    }

    const pipeline = new ConcourseTs.Pipeline(this._name)

    this._group_customisers.forEach((customise) => {
      const group_builder = new GroupBuilder()
      customise(group_builder)

      const group = group_builder.build()
      group.jobs.forEach((job) => {
        pipeline.add_job(job, group.name)
      })
    })

    this._job_customisers.forEach((customise) => {
      const job_builder = new JobBuilder()
      customise(job_builder)

      pipeline.add_job(job_builder.build())
    })

    this._customisers.forEach((customise) => {
      customise(pipeline)
    })

    return pipeline
  }

  private _name: string

  public name(name: string): PipelineBuilder {
    this._name = name

    return this
  }

  private _customisers: ConcourseTs.Type.Customiser<ConcourseTs.Pipeline>[] = []

  public apply(
    customiser: ConcourseTs.Type.Customiser<ConcourseTs.Pipeline>
  ): PipelineBuilder {
    this._customisers.push(customiser)

    return this
  }

  private _group_customisers: ConcourseTs.Type.Customiser<GroupBuilder>[] = []

  public group(
    customise: ConcourseTs.Type.Customiser<GroupBuilder>
  ): PipelineBuilder {
    this._group_customisers.push(customise)

    return this
  }

  private _job_customisers: ConcourseTs.Type.Customiser<JobBuilder>[] = []

  public job(customise: ConcourseTs.Type.Customiser<JobBuilder>): PipelineBuilder {
    this._job_customisers.push(customise)

    return this
  }
}
