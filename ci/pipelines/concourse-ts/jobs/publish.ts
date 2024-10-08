import fs from 'node:fs'
import * as ConcourseTs from '@decentm/concourse-ts'

import { git } from 'ci/resources/git'

// import { checks_job } from './checks'

import { scaffold_moon_task } from '../tasks/scaffold-moon'
import { docker } from '../lib/docker'
import { create_npm_resource } from 'ci/resources/npm'

const package_names = fs.readdirSync('packages')

export const publish_job = new ConcourseTs.Job('publish', (job) => {
  job.add_step(git.as_get_step({}))

  job.add_step(scaffold_moon_task('concourse-ts').as_task_step())

  job.add_step(
    new ConcourseTs.Task(
      'build',
      docker('build', { unpack_rootfs: true })
    ).as_task_step()
  )

  job.add_step(
    new ConcourseTs.Task('pack', (task) => {
      task.add_input({
        name: 'image',
      })

      task.add_output({
        name: `package-${ConcourseTs.Utils.get_var('.:package')}`,
      })

      task.run = new ConcourseTs.Command((command) => {
        command.dir = `image/rootfs/app/packages/${ConcourseTs.Utils.get_var('.:package')}`

        command.add_arg('-exuc')
        command.add_arg(`tar -czf ../../../../../package-${ConcourseTs.Utils.get_var('.:package')}/package.tar.gz package.json dist`)
      })
    }).as_task_step((step) => {
      step.add_across({
        values: package_names,
        var: ConcourseTs.Utils.get_identifier('package'),
        max_in_flight: 5,
      })
    })
  )

  for (const package_name of package_names) {
    const package_npm = create_npm_resource({ package: package_name })

    job.add_step(package_npm.as_put_step({
      inputs: [ConcourseTs.Utils.get_identifier(`package-${package_name}`)],
      params: {
        path: `package-${package_name}/package.tar.gz`,
      },
    }))
  }

})
