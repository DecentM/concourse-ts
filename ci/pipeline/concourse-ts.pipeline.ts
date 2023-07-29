import '../configure'

import * as ConcourseTs from '@decentm/concourse-ts'
import { create_auto_pipeline } from '@decentm/concourse-ts-recipe-auto-pipeline'

import { git_ci } from '../resources/git'
import { CliGroup, add_cli_group } from './groups/cli'

type Group = 'ci' | CliGroup

const auto_pipeline = create_auto_pipeline<Group>({
  cli_tag: 'v0.12.7-node20.3.1',
  path: 'ci/pipeline/concourse-ts.pipeline.ts',
  resource: git_ci,
  group: 'ci',
})

export default () => {
  return new ConcourseTs.Pipeline<Group>(
    'concourse-ts',
    auto_pipeline((pipeline) => {
      add_cli_group(pipeline)
    })
  )
}
