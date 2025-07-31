import * as ConcourseTs from '@decentm/concourse-ts'
import pkgJson from 'package.json'

import { alpine } from 'ci/commands'
import { NODE_VERSION } from 'ci/consts'
import { git } from 'ci/resources/git'

export const scaffold_moon_task = (pkg: string) =>
  new ConcourseTs.Task('scaffold', (task) => {
    task.add_input({ name: git.name })

    task.add_output({ name: git.name })

    task.set_image_resource({
      type: 'registry-image',
      source: {
        repository: 'node',
        tag: `${NODE_VERSION}-alpine`,
      },
    })

    const scaffold = new ConcourseTs.Command((command) => {
      command.dir = git.name
      command.path = '/usr/local/bin/yarn'
      command.add_args('dlx')
      command.add_args(`@moonrepo/cli@${pkgJson.devDependencies['@moonrepo/cli']}`)
      command.add_args('docker')
      command.add_args('scaffold')
      command.add_args(pkg)
    })

    const scaffold_and_install_git = ConcourseTs.Utils.join_commands(
      (args, command) => {
        command.path = '/bin/sh'

        command.add_args('-exuc')
        command.add_args(args.join(' && '))
      },
      alpine.apk_add('git'),
      scaffold
    )

    task.run = scaffold_and_install_git
  })
