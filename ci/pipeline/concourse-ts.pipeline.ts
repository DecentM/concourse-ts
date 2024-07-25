import '../configure.js'

import * as ConcourseTs from '@decentm/concourse-ts'
import { create_auto_pipeline } from '@decentm/concourse-ts-recipe-auto-pipeline'

import { git_ci } from '../resources/git'
import { CliGroup } from './groups/cli'

type Group = 'ci' | CliGroup

const name = 'concourse-ts'

const auto_pipeline = create_auto_pipeline<Group>({
  resource: git_ci,
  path: `.ci/pipeline/${name}.yml`,
})

export default () => {
  return new ConcourseTs.Pipeline<Group>(name, auto_pipeline())
}
