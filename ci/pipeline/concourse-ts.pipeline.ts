import '../configure.js'

import * as ConcourseTs from '@decentm/concourse-ts'
import { create_auto_pipeline } from '@decentm/concourse-ts-recipe-auto-pipeline'
import { create_oci_build } from '@decentm/concourse-ts-recipe-oci-build'

import { git_ci, git } from '../resources/git'
import { join_commands } from 'packages/concourse-ts/src/utils/index.js'
import { alpine } from 'ci/commands/index.js'

type Group = 'ci'

const name = 'concourse-ts'
const node_version = '20.16.0'

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
        NODE_VERSION: node_version,
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

          const scaffold_task = new ConcourseTs.Task('scaffold', (task) => {
            task.add_input({ name: git.name })

            task.add_output({ name: git.name })

            task.set_image_resource({
              type: 'registry-image',
              source: {
                repository: 'node',
                tag: `${node_version}-alpine`,
              },
            })

            const scaffold = new ConcourseTs.Command((command) => {
              command.dir = git.name
              command.path = '/usr/local/bin/yarn'
              command.add_arg('dlx')
              command.add_arg('@moonrepo/cli')
              command.add_arg('docker')
              command.add_arg('scaffold')
              command.add_arg('concourse-ts')
            })

            const scaffold_and_install_git = join_commands(
              (args, command) => {
                command.path = '/bin/sh'

                command.add_arg('-exuc')
                command.add_arg(args.join(' && '))
              },
              alpine.apk_add('git'),
              scaffold
            )

            task.run = scaffold_and_install_git
          }).as_task_step()

          job.add_step(scaffold_task)

          job.add_step(
            new ConcourseTs.InParallelStep('checks', (step) => {
              step.limit = 2

              step.add_step(
                new ConcourseTs.Task('lint', docker('lint')).as_task_step()
              )

              // test also runs a build
              step.add_step(
                new ConcourseTs.Task('test', docker('test')).as_task_step()
              )
            })
          )
        })
      )
    })
  )
}
