import * as ConcourseTs from '@decentm/concourse-ts'
import * as RegistryImage from '@decentm/concourse-ts-resource-registry-image'

/**
 * https://github.com/concourse/github-release-resource
 */
export type Source = {
  /**
   * The GitHub user or organization name for the repository that the releases
   * are in.
   */
  owner: string
  /**
   * The repository name that contains the releases.
   */
  repository: string
  /**
   * Used for accessing a release in a private-repo during an `in` and pushing a
   * release to a repo during an `out`. The access token you create is only
   * required to have the `repo` or `public_repo` scope.
   */
  access_token?: ConcourseTs.Utils.Secret
  /**
   * If you use a non-public GitHub deployment then you can set your API URL
   * here.
   */
  github_api_url?: string
  /**
   * If you use a non-public GitHub deployment then you can set your API URL for
   * graphql calls here.
   */
  github_v4_api_url?: string
  /**
   * Some GitHub instances have a separate URL for uploading. If
   * `github_api_url` is set, this value defaults to the same value, but if you
   * have your own endpoint, this field will override it.
   */
  github_uploads_url?: string
  /**
   * Default `false`. When set to `true`, concourse will allow insecure
   * connection to your github API.
   */
  insecure?: boolean
  /**
   * Default `true`. When set to `true`, `check` detects final releases and
   * `put` publishes final releases (as opposed to pre-releases). If `false`,
   * `check` will ignore final releases, and `put` will publish pre-releases if
   * `pre_release` is set to `true`
   */
  release?: boolean
  /**
   * Default `false`. When set to `true`, `check` detects pre-releases, and
   * `put` will produce pre-releases (if `release` is also set to `false`). If
   * `false`, only non-prerelease releases will be detected and published.
   *
   * **note:** if both `release` and `pre_release` are set to `true`, `put`
   * produces final releases and `check` detects both pre-releases and releases.
   * In order to produce pre-releases, you must set `pre_release` to `true` and
   * `release` to `false`.
   *
   * **note:** if both `release` and `pre_release` are set
   * to `false`, `put` will still produce final releases.
   *
   * **note:** releases must have [semver
   * compliant](https://semver.org/#backusnaur-form-grammar-for-valid-semver-versions)
   * tags to be detected.
   */
  pre_release?: boolean
  /**
   * Default `false`. When set to `true`, `put` produces drafts and `check` only
   * detects drafts. If `false`, only non-draft releases will be detected and
   * published. Note that releases must have [semver
   * compliant](https://semver.org/#backusnaur-form-grammar-for-valid-semver-versions)
   * tags to be detected, even if they're drafts.
   */
  drafts?: boolean
  /**
   * If set, constrain the returned semver tags according to a semver
   * constraint, e.g. `"~1.2.x"`, `">= 1.2 < 3.0.0 || >= 4.2.3"`. Follows the
   * rules outlined in
   * https://github.com/Masterminds/semver#checking-version-constraints.
   */
  semver_constraint?: string
  /**
   * If set, override default tag filter regular expression of `v?([^v].*)`. If
   * the filter includes a capture group, the capture group is used as the
   * release version; otherwise, the entire matching substring is used as the
   * version.
   */
  tag_filter?: string
  /**
   * One of [`version`, `time`]. Default `version`. Selects whether to order
   * releases by version (as extracted by `tag_filter`) or by time. See `check`
   * behavior described below for details.
   */
  order_by?: 'version' | 'time'
}

export type PutParams = {
  /**
   * A path to a file containing the name of the release.
   */
  name: string
  /**
   * A path to a file containing the name of the Git tag to use for the release.
   */
  tag: string
  /**
   * If specified, the tag read from the file will be prepended with this
   * string. This is useful for adding v in front of version numbers.
   */
  tag_prefix?: string
  /**
   * A path to a file containing the commitish (SHA, tag, branch name) that the
   * release should be associated with.
   */
  commitish?: string
  /**
   * A path to a file containing the body text of the release.
   */
  body?: string
  /**
   * A list of globs for files that will be uploaded alongside the created
   * release.
   */
  globs?: string[]
  /**
   * Causes GitHub to autogenerate the release notes when creating a new
   * release, based on the commits since the last release. If `body` is
   * specified, the body will be pre-pended to the automatically generated
   * notes. Has no effect when updating an existing release. Defaults to
   * `false`.
   */
  generate_release_notes?: boolean
}

export type GetParams = {
  /**
   * A list of globs for files that will be downloaded from the release. If not
   * specified, all assets will be fetched.
   */
  globs?: string[]
  /**
   * Enables downloading of the source artifact tarball for the release as
   * `source.tar.gz`. Defaults to `false`.
   */
  include_source_tarball?: boolean
  /**
   * Enables downloading of the source artifact zip for the release as
   * `source.zip`. Defaults to `false`.
   */
  include_source_zip?: boolean
}

export type Resource = ConcourseTs.Resource<Source, PutParams, GetParams>

export type ResourceType = ConcourseTs.ResourceType<
  'registry-image',
  RegistryImage.Source<''>
>
