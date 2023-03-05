import * as ConcourseTs from '@decentm/concourse-ts'
import * as RegistryImage from '@decentm/concourse-ts-resource-registry-image'
import * as Git from '@decentm/concourse-ts-resource-git'

type PasswordAuth = {
  /**
   * username of the user which have access to repository.
   */
  username: string | ConcourseTs.Utils.Var
  /**
   * password of that user
   */
  password: ConcourseTs.Utils.Var
  oauth_id?: undefined
  oauth_secret?: undefined
}

type OauthAuth = {
  /**
   * username of the user which have access to repository.
   */
  username: string | ConcourseTs.Utils.Var
  password?: undefined
  /**
   * Oauth id of an OAuth consumer configured as private and with permission to
   * write to PRs.
   */
  oauth_id?: ConcourseTs.Utils.Var
  /**
   * Oauth secret of the same consumer.
   */
  oauth_secret?: ConcourseTs.Utils.Var
}

export type Source = (PasswordAuth | OauthAuth) & {
  /**
   * base URL of the bitbucket server, without a trailing slash. For example:
   * `http://bitbucket.local`
   */
  base_url: string
  /**
   * project for tracking
   */
  project: string
  /**
   * repository for tracking
   */
  repository: string
  /**
   * limit of tracked pull requests `default: 100`.
   */
  limit?: number
  /**
   * configuration is based on the [Git
   * resource](https://github.com/concourse/git-resource). The `branch`
   * configuration from the original resource is ignored.
   */
  git: Git.Source
  /**
   * cloud for BitBucket Cloud or server for a self-hosted BitBucket Server.
   * `default: server`
   */
  bitbucket_type?: 'cloud' | 'server'
  /**
   * @deprecated set to name of the resource if resource name is different than
   * repository name. Is deprecated in favor to `params.repository` in `out`.
   */
  dir?: string
  /**
   * if given, only pull requests against this branch will be checked
   */
  branch?: string
  /**
   * if specified (as a list of glob patterns), only changes to the specified
   * files will yield new versions from check
   */
  paths?: string[]
  /**
   * the maximum number of changed `paths` loaded for each pull-request. `default:
   * 100`. It works only with the `paths` parameter.
   */
  changes_limit?: number
  /**
   * the direction relative to the specified repository, either `incoming`
   * (destination, e.g. to master) or `outgoing` (source, e.g. from feature).
   */
  direction?: 'incoming' | 'outgoing'
  /**
   * prevent *check* from emitting new versions when only the pull request title
   * changes, except when the string "WIP" is removed from the title.
   */
  exclude_title?: boolean
  /**
   * Disable SSL verification on the Bitbucket API calls.
   */
  skip_ssl_verification?: boolean
  /**
   * Custom CA certs to use to verify Bitbucket API calls.
   */
  ssl_cacert?: ConcourseTs.Utils.Var
}

export type PutParams = {
  /**
   * Parameters except the name will be respected the [Bitbucket
   * documentation](https://developer.atlassian.com/server/bitbucket/how-tos/updating-build-status-for-commits/).
   */
  action: 'push' | 'change-build-status'
  /**
   * @deprecated Parameter is deprecated and has been left only for backward
   * compatibility.
   */
  name?: string
  /**
   * The path of the source repository for changing build status.
   */
  repository?: string
  /**
   * https://developer.atlassian.com/server/bitbucket/how-tos/updating-build-status-for-commits/#adding-a-build-result-to-a-commit
   */
  state: 'INPROGRESS' | 'SUCCESSFUL' | 'FAILED'
  /**
   * https://developer.atlassian.com/server/bitbucket/how-tos/updating-build-status-for-commits/#adding-a-build-result-to-a-commit
   */
  key: string
  /**
   * https://developer.atlassian.com/server/bitbucket/how-tos/updating-build-status-for-commits/#adding-a-build-result-to-a-commit
   */
  url: string
  /**
   * https://developer.atlassian.com/server/bitbucket/how-tos/updating-build-status-for-commits/#adding-a-build-result-to-a-commit
   */
  description?: string
}

export type GetParams = {
  /**
   * Skip git pull. Artifacts based on the git will not be present.
   */
  skip_download?: boolean
  /**
   * Also fetch the pull requests' upstream ref. This will overwrite the fetch
   * param.
   */
  fetch_upstream?: boolean
}

export type Resource = ConcourseTs.Resource<Source, PutParams, GetParams>

export type ResourceType = ConcourseTs.ResourceType<
  'registry-image' & ConcourseTs.Utils.Identifier,
  RegistryImage.Source<'zarplata/concourse-git-bitbucket-pr-resource'>
>
