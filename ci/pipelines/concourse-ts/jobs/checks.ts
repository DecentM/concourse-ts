import * as ConcourseTs from '@decentm/concourse-ts'

import { git } from 'ci/resources/git'

import { docker } from '../lib/docker'
import { scaffold_moon_task } from '../tasks/scaffold-moon'

export const checks_job = new ConcourseTs.Job('checks', (job) => {
  job.add_step(git.as_get_step())

  const scaffold_task = scaffold_moon_task('concourse-ts').as_task_step()

  job.add_step(scaffold_task)

  job.add_step(
    new ConcourseTs.InParallelStep('checks', (step) => {
      step.limit = 2

      step.add_step(new ConcourseTs.Task('lint', docker('lint')).as_task_step())

      // test also runs a build
      step.add_step(new ConcourseTs.Task('test', docker('test')).as_task_step())
    })
  )
})
