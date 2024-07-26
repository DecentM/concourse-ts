import '../configure.js'

import * as ConcourseTs from '@decentm/concourse-ts'
import { create_auto_pipeline } from '@decentm/concourse-ts-recipe-auto-pipeline'
import { create_oci_build } from '@decentm/concourse-ts-recipe-oci-build'

import { git_ci, git } from '../resources/git'

type Group = 'ci'

const name = 'concourse-ts'

const auto_pipeline = create_auto_pipeline<Group>({
  resource: git_ci,
  path: `.ci/pipeline/${name}.yml`,
})

const docker = (
  target: string,
  extra_args: Record<string, string> = {},
  customise?: (
    instance: ConcourseTs.Task<
      ConcourseTs.Utils.Identifier,
      ConcourseTs.Utils.Identifier
    >
  ) => void
) => {
  const oci_build = create_oci_build({
    resource: git,
    options: {
      target,
      build_args: {
        NODE_ENV: 'production',
        NODE_VERSION: '20.15',
        ...extra_args,
      },
    },
  })

  return oci_build(customise)
}

export default () => {
  return new ConcourseTs.Pipeline<Group>(
    name,
    auto_pipeline((pipeline) => {
      pipeline.add_job(
        new ConcourseTs.Job('checks', (job) => {
          job.add_step(git.as_get_step())

          job.add_step(new ConcourseTs.Task('build', docker('build')).as_task_step())
          job.add_step(new ConcourseTs.Task('lint', docker('lint')).as_task_step())
          job.add_step(new ConcourseTs.Task('test', docker('build')).as_task_step())

          // job.add_step(
          //   new ConcourseTs.Task('yarn', (task) => {
          //     task.add_input({ name: git.name })
          //     task.add_output({ name: git.name })

          //     task.add_cache({
          //       path: './.yarn/cache',
          //     })

          //     task.set_image_resource({y
          //       type: 'registry-image',
          //       source: {
          //         repository: 'node',
          //         tag: '20.15-alpine',
          //       },
          //     })

          //     task.run = new ConcourseTs.Command((command) => {
          //       command.dir = git.name
          //       command.path = '/usr/local/bin/yarn'
          //       command.add_arg('--immutable')
          //     })
          //   }).as_task_step()
          // )

          // job.add_step(
          //   new ConcourseTs.Task('lint', (task) => {
          //     task.add_input({
          //       name: git.name,
          //     })

          //     task.set_image_resource({
          //       type: 'registry-image',
          //       source: {
          //         repository: 'node',
          //         tag: '20.15-alpine',
          //       },
          //     })

          //     task.run = new ConcourseTs.Command((command) => {
          //       command.dir = git.name
          //       command.path = '/usr/local/bin/yarn'
          //       command.add_arg('moon')
          //       command.add_arg(':lint')
          //     })
          //   }).as_task_step()
          // )
        })
      )
    })
  )
}
