import '../configure.js'

import * as ConcourseTs from '@decentm/concourse-ts'

import { git_ci } from '../resources/git'
import { CliGroup } from './groups/cli'

type Group = 'ci' | CliGroup

export default () => {
  return new ConcourseTs.Pipeline<Group>('concourse-ts', (pipeline) => {
    pipeline.add_job(
      new ConcourseTs.Job('ci', (job) => {
        job.add_step(git_ci.as_get_step())
        job.add_step(
          new ConcourseTs.SetPipelineStep('set-pipeline', (step) => {
            step.file = `${git_ci.name}/.ci/pipeline/concourse-ts.yml`
            step.set_pipeline = 'self'
          })
        )
      })
    )
  })
}
