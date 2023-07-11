import * as ConcourseTs from '@decentm/concourse-ts'

import * as Npm from '@decentm/concourse-ts-resource-npm'
import {
  create_npm_dependencies,
  DependencyPackageNames,
} from '@decentm/concourse-ts-recipe-npm-dependencies'

import { git } from '../../resources/git'

import cli_pkg from '../../../packages/concourse-ts-cli/package.json'

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

    job.add_step(get_dependencies)

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
  })

  pipeline.add_job(build_cli_job, 'cli')
}
