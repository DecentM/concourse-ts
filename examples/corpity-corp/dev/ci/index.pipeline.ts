// import {...} from '@corpity-corp/ci'
import {Pipeline, Resource} from '../../sre/src'

export default () => {
  return new Pipeline('test', (pipeline) => {
    const gitResource = new Resource.GitRepo('my_repo', {
      repository: 'project-zeus/webserver',
      branch: 'main',
      ignore_paths: ['.ci', 'artifacts'],
    })

    pipeline.add_resource(gitResource)
  })
}
