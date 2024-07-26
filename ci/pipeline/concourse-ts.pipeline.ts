import '../configure.js'

import * as ConcourseTs from '@decentm/concourse-ts'
import { create_auto_pipeline } from '@decentm/concourse-ts-recipe-auto-pipeline'

import { git_ci, git } from '../resources/git'

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
      const install_dependencies_job = new ConcourseTs.Job(
        'install_dependencies',
        (job) => {
          job.add_step(git.as_get_step())

          const task = new ConcourseTs.Task('yarn', (task) => {
            task.add_input({
              name: git.name,
            })

            task.add_output({
              name: 'node_modules',
              path: `${git.name}/node_modules`,
            })

            task.add_cache({
              path: './.yarn/cache',
            })

            task.set_image_resource({
              type: 'registry-image',
              source: {
                repository: 'node',
                tag: '20.15-alpine',
              },
            })

            task.run = new ConcourseTs.Command((command) => {
              command.dir = git.name
              command.path = '/usr/local/bin/yarn'
              command.add_arg('--immutable')
            })
          })

          job.add_step(task.as_task_step())
        }
      )

      pipeline.add_job(install_dependencies_job)

      pipeline.add_job(
        new ConcourseTs.Job('lint', (job) => {
          job.add_step(
            git.as_get_step({
              passed: [install_dependencies_job],
            })
          )

          const task = new ConcourseTs.Task('lint', (task) => {
            task.add_input({
              name: git.name,
            })

            task.add_input({
              name: 'node_modules',
              path: `${git.name}/node_modules`,
            })

            task.set_image_resource({
              type: 'registry-image',
              source: {
                repository: 'node',
                tag: '20.15-alpine',
              },
            })

            task.run = new ConcourseTs.Command((command) => {
              command.dir = git.name
              command.path = '/usr/local/bin/yarn'
              command.add_arg('moon')
              command.add_arg(':lint')
            })
          })

          job.add_step(task.as_task_step())
        })
      )
    })
  )
}
