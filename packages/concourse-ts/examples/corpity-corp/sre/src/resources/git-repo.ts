import * as ConcourseTs from '../../../../../src'

import {GIT_PASSWORD, GIT_HOST, GIT_USERNAME} from '../constants/git'

export type GitRepoInput = {
  repository: string
  branch?: string
  paths?: string[]
  ignore_paths?: string[]
}

export class GitRepo extends ConcourseTs.Presets.Resource.GitRepo {
  constructor(name: string, input: GitRepoInput) {
    const dotGit = input.repository.endsWith('.git')

    super(name, {
      uri: `https://${GIT_HOST}/${
        dotGit ? input.repository : `${input.repository}.git`
      }`,
      branch: input.branch,
      paths: input.paths,
      ignore_paths: input.ignore_paths,

      username: GIT_USERNAME,
      password: GIT_PASSWORD,
      submodule_credentials: [
        {
          host: GIT_HOST,
          username: GIT_USERNAME,
          password: GIT_PASSWORD,
        },
      ],
    })

    this.set_check_every({minutes: 5})
  }
}
