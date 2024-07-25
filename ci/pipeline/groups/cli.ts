import * as ConcourseTs from '@decentm/concourse-ts'

import { create_oci_build } from '@decentm/concourse-ts-recipe-oci-build'

import { git } from '../../resources/git'
import { cli_registry_image } from '../../resources/registry-image'

import cli_pkg from '../../../packages/concourse-ts-cli/package.json'

const across_node: ConcourseTs.Type.Across = {
  var: ConcourseTs.Utils.get_identifier('node'),
  values: ['20.3.1', '20.2.0'],
}

const across_alpine: ConcourseTs.Type.Across = {
  var: ConcourseTs.Utils.get_identifier('alpine'),
  values: ['3.20'],
}

const node = ConcourseTs.Utils.get_var(`.:${across_node.var}`)
const alpine = ConcourseTs.Utils.get_var(`.:${across_alpine.var}`)

cli_pkg.dependencies[cli_pkg.name] = cli_pkg.version

export type CliGroup = 'cli'

export const add_cli_group = (pipeline: ConcourseTs.Pipeline<CliGroup>) => {
  const build_cli_job = new ConcourseTs.Job('build-cli', (job) => {
    job.add_step(git.as_get_step())

    const oci_build = create_oci_build({
      resource: git,
      options: {
        dockerfile: `${git.name}/Dockerfile`,
        target: 'cli',
        build_args: {
          BASE_IMAGE: `node:${node}-alpine${alpine}`,
        },
        image_platform: ['linux/amd64'],
        output_oci: true,
      },
    })

    const build_cli_task = new ConcourseTs.Task('build_cli', oci_build())

    const build_cli_step = build_cli_task.as_task_step((step) => {
      step.add_across(across_node)
      step.add_across(across_alpine)

      step.add_on_success(
        cli_registry_image.as_put_step({
          params: {
            image: 'image/image.tar',
            additional_tags: 'image-meta/additional-tags',
          },
        })
      )
    })

    job.add_step(
      new ConcourseTs.InParallelStep('build-and-push', (ips) => {
        ips.add_step(build_cli_step)
      })
    )
  })

  pipeline.add_job(build_cli_job, 'cli')
}
