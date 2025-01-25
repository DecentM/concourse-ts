import * as ConcourseTs from '@decentm/concourse-ts'
import * as RegistryImage from '@decentm/concourse-ts-resource-registry-image'

/**
 * https://github.com/telia-oss/github-pr-resource
 */
export type Source = {
  /**
   * The repository to target.
   *
   * Example: itsdalmo/test-repository`
   */
  repository: string
  /**
   * A Github Access Token with repository access (required for setting status
   * on commits). N.B. If you want github-pr-resource to work with a private
   * repository. Set `repo:full` permissions on the access token you create on
   * GitHub. If it is a public repository, `repo:status` is enough.
   */
  access_token: string
  /**
   * Endpoint to use for the V3 Github API (Restful).
   *
   * Example: `https://api.github.com`
   */
  v3_endpoint?: string
  /**
   * Endpoint to use for the V4 Github API (Graphql).
   *
   * Example: `https://api.github.com/graphql`
   */
  v4_endpoint?: string
  /**
   * Only produce new versions if the PR includes changes to files that match
   * one or more glob patterns or prefixes.
   *
   * Example: `["terraform/*.tf"]`
   */
  paths?: string[]
  /**
   * Inverse of the above. Pattern syntax is documented in
   * [filepath.Match](https://golang.org/pkg/path/filepath/#Match), or a path
   * prefix can be specified (e.g. `.ci/` will match everything in the `.ci`
   * directory).
   *
   * Example: `[".ci/"]`
   */
  ignore_paths?: string[]
  /**
   * Disable ability to skip builds with `[ci skip]` and `[skip ci]` in commit
   * message or pull request title.
   *
   * Example: `true`
   */
  disable_ci_skip?: boolean
  /**
   * Disable SSL/TLS certificate validation on git and API clients. Use with
   * care!
   *
   * Example: `true`
   */
  skip_ssl_verification?: boolean
  /**
   * Disable triggering of the resource if the pull request's fork repository is
   * different to the configured repository.
   *
   * Example: `true`
   */
  disable_forks?: boolean
  /**
   * Disable triggering of the resource if the pull request is in Draft status.
   *
   * Example: `false`
   */
  ignore_drafts?: boolean
  /**
   * Disable triggering of the resource if the pull request does not have at
   * least `X` approved review(s).
   *
   * Example: `2`
   */
  required_review_approvals?: number
  /**
   * Base64 encoded git-crypt key. Setting this will unlock / decrypt the
   * repository with git-crypt. To get the key simply execute `git-crypt
   * export-key -- - | base64` in an encrypted repository.
   *
   * Example:
   */
  git_crypt_key?: ConcourseTs.Utils.Var
  /**
   * Name of a branch. The pipeline will only trigger on pull requests against
   * the specified branch.
   *
   * Example: `master`
   */
  base_branch?: string
  /**
   * The labels on the PR. The pipeline will only trigger on pull requests
   * having at least one of the specified labels.
   *
   * Example: `["bug", "enhancement"]`
   */
  labels?: string[]
  /**
   * Disable Git LFS, skipping an attempt to convert pointers of files tracked
   * into their corresponding objects when checked out into a working copy.
   *
   * Example: `true`
   */
  disable_git_lfs?: boolean
  /**
   * The PR states to select (`OPEN`, `MERGED` or `CLOSED`). The pipeline will
   * only trigger on pull requests matching one of the specified states. Default
   * is ["OPEN"].
   *
   * Example: `["OPEN", "MERGED"]`
   */
  states?: Array<'OPEN' | 'MERGED' | 'CLOSED'>
}

export type GetParams = {
  /**
   * Use with `get_params` in a `put` step to do nothing on the implicit get.
   *
   * Example: `true`
   */
  skip_download?: boolean
  /**
   * The integration tool to use, `merge`, `rebase` or `checkout`. Defaults to
   * `merge`.
   *
   * Example: `rebase`
   */
  integration_tool?: 'merge' | 'rebase' | 'checkout'
  /**
   * Shallow clone the repository using the `--depth` Git option
   *
   * Example: `1`
   */
  git_depth?: number
  /**
   * Recursively clone git submodules. Defaults to false.
   *
   * Example: `true`
   */
  submodules?: boolean
  /**
   * Generate a list of changed files and save alongside metadata
   *
   * Example: `true`
   */
  list_changed_files?: boolean
  /**
   * Fetch tags from remote repository
   *
   * Example: `true`
   */
  fetch_tags?: boolean
}

export type PutParams = {
  /**
   * The name given to the resource in a GET step.
   *
   * Example: `pull-request`
   */
  path: string
  /**
   * Set a status on a commit. One of `SUCCESS`, `PENDING`, `FAILURE` and
   * `ERROR`.
   *
   * Example: `SUCCESS`
   */
  status?: 'SUCCESS' | 'PENDING' | 'FAILURE' | 'ERROR'
  /**
   * Base context (prefix) used for the status context. Defaults to
   * `concourse-ci`.
   *
   * Example: `concourse-ci`
   */
  base_context?: string
  /**
   * A context to use for the status, which is prefixed by `base_context`.
   * Defaults to `status`.
   *
   * Example: `unit-test`
   */
  context?: string
  /**
   * A comment to add to the pull request.
   *
   * Example: `hello world!`
   */
  comment?: string
  /**
   * Path to file containing a comment to add to the pull request (e.g. output
   * of `terraform plan`).
   *
   * Example: `my-output/comment.txt`
   */
  comment_file?: string
  /**
   * The target URL for the status, where users are sent when clicking details
   * (defaults to the Concourse build page).
   *
   * Example: `$ATC_EXTERNAL_URL/builds/$BUILD_ID`
   */
  target_url?: string
  /**
   * The description status on the specified pull request.
   *
   * Example: `Concourse CI build failed`
   */
  description?: string
  /**
   * Path to file containing the description status to add to the pull request
   *
   * Example: `my-output/description.txt`
   */
  description_file?: string
  /**
   * Boolean. Previous comments made on the pull request by this resource will
   * be deleted before making the new comment. Useful for removing outdated
   * information.
   *
   * Example: `true`
   */
  delete_previous_comments?: boolean
}

export type Resource = ConcourseTs.Resource<Source, PutParams, GetParams, 'registry-image', RegistryImage.Source<'teliaoss/github-pr-resource'>>

export type ResourceType = ConcourseTs.ResourceType<
  'registry-image',
  RegistryImage.Source<'teliaoss/github-pr-resource'>
>
