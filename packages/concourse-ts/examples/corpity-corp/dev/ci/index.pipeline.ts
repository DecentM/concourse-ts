// import {...} from '@corpity-corp/ci'
import {Pipeline, Resource, Job, Task} from '../../sre/src'

export type Group = 'static_analysis' | 'aws_deployment' | 'vercel_deployment'

export default () => {
  return new Pipeline<Group>('test', (pipeline) => {
    const git = new Resource.GitRepo('my_repo', {
      repository: 'project-zeus/webserver',
      branch: 'main',
      ignore_paths: ['.ci', 'artifacts'],
    })

    const slack = new Resource.SlackNotification('slack')
    const testJob = new Job('test-job')
    const getRepo = git.as_get_step({})

    testJob.add_step(getRepo)

    const task = new Task('my-task', (task) => {
      task.set_image_resource({
        type: 'registry-image',

        source: {
          repository: 'alpine',
        },
      })

      task.run = {
        path: '/bin/sh',

        args: [
          '-c',
          `
            set -exu
            echo Hellowo!
          `,
        ],
      }
    })

    testJob.add_step(
      task.as_task_step((ts) => {
        ts.privileged = true
      })
    )

    slack.as_failure_handler(testJob, slack.get_params_for('failure'))
    slack.as_success_handler(testJob, slack.get_params_for('success'))

    pipeline.add_job(testJob, 'static_analysis')
  })
}
