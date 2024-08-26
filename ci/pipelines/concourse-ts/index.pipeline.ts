import 'ci/configure'

import * as ConcourseTs from '@decentm/concourse-ts'
import { create_auto_pipeline } from '@decentm/concourse-ts-recipe-auto-pipeline'

import { git_ci } from 'ci/resources/git'

// import { checks_job } from './jobs/checks'
import { publish_job } from './jobs/publish'

type Group = 'ci'

const name = 'concourse-ts'

const auto_pipeline = create_auto_pipeline<Group>({
  resource: git_ci,
  path: `.ci/pipeline/${name}.yml`,
})

export default () => {
  return new ConcourseTs.Pipeline<Group>(
    name,
    auto_pipeline((pipeline) => {
      // pipeline.add_job(checks_job)
      pipeline.add_job(publish_job)
    })
  )
}
