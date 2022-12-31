import * as ConcourseTs from '../../../../../src/index'

import {DURATION_1_MINUTE} from '../constants/duration'
import {GIT_PASSWORD, GIT_HOST, GIT_USERNAME} from '../constants/git'

import {Git} from '../resource-types/git'

export type GitRepoInput = {
  repository: string
  branch?: string
  paths?: string[]
  ignore_paths?: string[]
}

/**
 * https://github.com/concourse/git-resource#source-configuration
 */
type GitSource = {
  uri: string
  branch?: string
  private_key?: string
  private_key_user?: string
  private_key_passphrase?: string
  forward_agent?: boolean
  username?: string
  password?: string
  paths?: string[]
  ignore_paths?: string[]
  skip_ssl_verification?: boolean
  tag_filter?: string
  tag_regex?: string
  fetch_tags?: boolean
  submodule_credentials?: Array<{
    host: string
    username: string
    password: string
  }>
  git_config?: Record<string, string>
  disable_ci_skip?: boolean
  commit_verification_keys?: string[]
  commit_verification_key_ids?: string[]
  gpg_keyserver?: string
  git_crypt_key?: string
  https_tunnel?: {
    proxy_host: string
    proxy_port: number
    proxy_user?: string
    proxy_password?: string
  }
  commit_filter?: {
    exlude?: string[]
    include?: string[]
  }
  version_depth?: number
  search_remote_refs?: boolean
}

export class GitRepo extends ConcourseTs.Resource<GitSource> {
  constructor(name: string, input: GitRepoInput) {
    const type = new Git()

    super(name, type)

    this.set_check_every(DURATION_1_MINUTE)

    const dotGit = input.repository.endsWith('.git')

    this.source = {
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
    }
  }
}
