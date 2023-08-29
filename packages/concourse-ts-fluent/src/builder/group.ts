import * as ConcourseTs from '@decentm/concourse-ts'

import { JobBuilder } from './job'

type BuiltGroup = {
  name: string
  jobs: ConcourseTs.Job[]
}

export class GroupBuilder {
  private _name: string

  public name(name: string): GroupBuilder {
    this._name = name

    return this
  }

  public build(): BuiltGroup {
    return {
      name: this._name,
      jobs: this.jobs,
    }
  }

  private jobs: ConcourseTs.Job[] = []

  public job(customise: ConcourseTs.Type.Customiser<JobBuilder>): GroupBuilder {
    const job_builder = new JobBuilder()

    customise(job_builder)
    this.jobs.push(job_builder.build())

    return this
  }
}
