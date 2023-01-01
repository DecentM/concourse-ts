import * as ConcourseTs from '../../../../../src'

import {GIT_PASSWORD, GIT_HOST, GIT_USERNAME} from '../constants/git'

import {Git} from '../resource-types/git'

export type GitRepoInput = {
  repository: string
  branch?: string
  paths?: string[]
  ignore_paths?: string[]
}

/**
 * https://github.com/concourse/git-resource#parameters
 */
type GitGetParams = {
  depth?: number
  fetch_tags?: boolean
  submodules?: 'all' | 'none' | string[]
  submodule_recursive?: boolean
  disable_git_lfs?: boolean
  clean_tags?: boolean
  /**
   * printf format
   *
   * Default: %s
   */
  short_ref_format?: string
  /**
   * Default: iso8601
   */
  timestamp_format?: string
  /**
   * Default: --always --dirty --broken
   */
  describe_ref_options?: string
}

type GitPutRebase = {
  rebase?: boolean
}

type GitPutMerge = {
  merge?: boolean
}

/**
 * https://github.com/concourse/git-resource#parameters-1
 */
type GitPutParams = (GitPutRebase | GitPutMerge) & {
  repository: string
  returning?: 'merged' | 'unmerged'
  /**
   * Path to a file containing the name of the tag
   */
  tag?: string
  only_tag?: boolean
  tag_prefix?: string
  force?: boolean
  /**
   * Path to a file containing the annotation message.
   */
  annotate?: string
  /**
   * Path to a file containing the notes
   */
  notes?: string
  branch?: string
  /**
   * Default: refs/heads
   */
  refs_prefix?: string
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

export class GitRepo extends ConcourseTs.Resource<
  GitSource,
  GitPutParams,
  GitGetParams
> {
  constructor(name: string, input: GitRepoInput) {
    const type = new Git()

    super(name, type)

    this.set_check_every(ConcourseTs.Utils.get_duration({minutes: 1}))

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
