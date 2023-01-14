// import {...} from '@corpity-corp/ci'
import {Pipeline, Resource, Job} from '../../sre/src'

export default () => {
  return new Pipeline('test', (pipeline) => {
    const git = new Resource.GitRepo('my_repo', {
      repository: 'project-zeus/webserver',
      branch: 'main',
      ignore_paths: ['.ci', 'artifacts'],
    })

    const slack = new Resource.SlackNotification('slack')
    const testJob = new Job('test-job')
    const getRepo = git.as_get_step({})

    testJob.add_step(getRepo)

    slack.as_failure_handler(testJob, slack.get_params_for('failure'))
    slack.as_success_handler(testJob, slack.get_params_for('success'))

    pipeline.add_job(testJob)
  })
}
