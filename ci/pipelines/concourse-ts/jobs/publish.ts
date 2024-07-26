import fs from 'node:fs'
import * as ConcourseTs from '@decentm/concourse-ts'

import { git } from 'ci/resources/git'
import { NODE_VERSION } from 'ci/consts'

import { checks_job } from './checks'

import { scaffold_moon_task } from '../tasks/scaffold-moon'
import { docker } from '../lib/docker'

const package_names = fs.readdirSync('packages')

export const publish_job = new ConcourseTs.Job('publish', (job) => {
  job.add_step(git.as_get_step({ passed: [checks_job] }))

  job.add_step(scaffold_moon_task('concourse-ts').as_task_step())

  job.add_step(
    new ConcourseTs.Task(
      'build',
      docker('build', { unpack_rootfs: true })
    ).as_task_step()
  )

  job.add_step(
    new ConcourseTs.Task('publish', (task) => {
      task.add_input({ name: 'image' })

      task.set_image_resource({
        type: 'registry-image',
        source: {
          repository: 'node',
          tag: `${NODE_VERSION}-alpine`,
        },
      })

      task.run = new ConcourseTs.Command((command) => {
        command.dir = 'image/rootfs/app'
        command.path = '/bin/ls'
        command.add_arg(
          `packages/${ConcourseTs.Utils.get_var('.:package')}/package.json`
        )
      })
    }).as_task_step((step) => {
      step.add_across({
        var: ConcourseTs.Utils.get_identifier('package'),
        values: package_names,
        max_in_flight: 5,
      })
    })
  )
})
