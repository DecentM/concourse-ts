import * as ConcourseTs from '@decentm/concourse-ts'

import * as Npm from '@decentm/concourse-ts-resource-npm'
import { create_oci_build } from '@decentm/concourse-ts-recipe-oci-build'
import {
  create_npm_dependencies,
  DependencyPackageNames,
} from '@decentm/concourse-ts-recipe-npm-dependencies'

import { git, git_ci } from '../../resources/git'
import { cli_registry_image } from '../../resources/registry-image'

import cli_pkg from '@decentm/concourse-ts-cli/package.json'

const across_node: ConcourseTs.Type.Across = {
  var: ConcourseTs.Utils.get_identifier('node'),
  values: ['20.3.1', '20.2.0', '18.16.1'],
}

const across_alpine: ConcourseTs.Type.Across = {
  var: ConcourseTs.Utils.get_identifier('alpine'),
  values: ['3.18'],
}

const node = ConcourseTs.Utils.get_var(`.:${across_node.var}`)
const alpine = ConcourseTs.Utils.get_var(`.:${across_alpine.var}`)

const npm_type: Npm.ResourceType = new ConcourseTs.ResourceType('npm', (rt) => {
  rt.set_type('registry-image')

  rt.source = {
    repository: 'timotto/concourse-npm-resource',
    tag: 'fbd2113',
  }
})

export type CliGroup = 'cli'

export const add_cli_group = (pipeline: ConcourseTs.Pipeline<CliGroup>) => {
  const build_cli_job = new ConcourseTs.Job('build-cli', (job) => {
    job.add_step(git.as_get_step())

    const npm_dependencies = create_npm_dependencies(cli_pkg, {
      resource_type: npm_type,
    })

    let vars: Record<
      DependencyPackageNames<typeof cli_pkg>,
      ConcourseTs.Utils.Var
    > = {} as Record<DependencyPackageNames<typeof cli_pkg>, ConcourseTs.Utils.Var>

    const get_dependencies = new ConcourseTs.InParallelStep(
      'get_dependencies',
      npm_dependencies((ips, var_names) => {
        ips.fail_fast = true
        ips.limit = 3
        vars = var_names
      })
    )

    const oci_build = create_oci_build({
      resource: git,
      options: {
        dockerfile: `${git.name}/Dockerfile.cli`,
        build_args: {
          BASE_IMAGE: `node:${node}-alpine${alpine}`,
          ...vars,
        },
        image_platform: ['linux/amd64'],
        output_oci: true,
      },
    })

    const build_cli_task = new ConcourseTs.Task('build_cli', oci_build())

    job.add_step(get_dependencies, build_cli_task.as_task_step())

    const write_tags = new ConcourseTs.Task('write_tags', (task) => {
      task.platform = 'linux'

      task.add_input({
        name: 'image',
      })

      task.add_output({
        name: 'image-meta',
      })

      task.set_image_resource({
        type: 'registry-image',
        source: {
          repository: 'alpine',
          tag: 'latest',
        },
      })

      task.run = new ConcourseTs.Command('write_tags', (command) => {
        command.path = '/bin/sh'
        command.add_arg('-exuc')

        command.add_arg(
          `echo v${vars['concourse-ts-cli']}-node${node} > image-meta/additional-tags`
        )
      })
    })

    const build_cli_step = build_cli_task.as_task_step((step) => {
      step.add_across(across_node)
      step.add_across(across_alpine)

      step.add_on_success(write_tags.as_task_step())

      step.add_on_success(
        cli_registry_image.as_put_step({
          params: {
            image: 'image/image.tar',
            additional_tags: 'image-meta/additional-tags',
          },
        })
      )
    })

    job.add_step(build_cli_step)
  })

  pipeline.add_job(build_cli_job, 'cli')
}
