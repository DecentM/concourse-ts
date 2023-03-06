import * as ConcourseTs from '@decentm/concourse-ts'
import * as RegistryImage from '@decentm/concourse-ts-resource-registry-image'

export type Source = {
  /**
   * The location of the repository.
   */
  uri: string
  /**
   * The branch to track. This is optional if the resource is only used in get
   * steps; however, it is required when used in a put step. If unset for get,
   * the repository's default branch is used; usually master but could be
   * different.
   */
  branch?: string
  /**
   * Private key to use when pulling/pushing.
   *
   * Example:
   * ```
   * -----BEGIN RSA PRIVATE KEY-----
    MIIEowIBAAKCAQEAtCS10/f7W7lkQaSgD/mVeaSOvSF9ql4hf/zfMwfVGgHWjj+W
    <Lots more text>
    DWiJL+OFeg9kawcUL6hQ8JeXPhlImG6RTUffma9+iGQyyBMCGd1l
    -----END RSA PRIVATE KEY-----
    ```
   */
  private_key?: ConcourseTs.Utils.Var
  /**
   * Enables setting User in the ssh config.
   */
  private_key_user?: ConcourseTs.Utils.Var
  /**
   * To unlock `private_key` if it is protected by a passphrase.
   */
  private_key_passphrase?: ConcourseTs.Utils.Var
  /**
   *  Enables ForwardAgent SSH option when set to true. Useful when using
   *  proxy/jump hosts. Defaults to false.
   */
  forward_agent?: boolean
  /**
   * Username for HTTP(S) auth when pulling/pushing. This is needed when only
   * HTTP/HTTPS protocol for git is available (which does not support private
   * key auth) and auth is required.
   */
  username?: ConcourseTs.Utils.Var | string
  /**
   * Password for HTTP(S) auth when pulling/pushing.
   */
  password?: ConcourseTs.Utils.Var
  /**
   * If specified (as a list of glob patterns), only changes to the specified
   * files will yield new versions from check.
   */
  paths?: string[]
  /**
   * The inverse of `paths`; changes to the specified files are ignored.
   *
   * Note that if you want to push commits that change these files via a `put`,
   * the commit will still be "detected", as [`check` and `put` both introduce
   * versions](https://github.com/concourse/concourse/issues/534). To avoid this
   * you should define a second resource that you use for commits that change
   * files that you don't want to feed back into your pipeline - think of one as
   * read-only (with `ignore_paths`) and one as write-only (which shouldn't need
   * it).
   */
  ignore_paths?: string[]
  /**
   * Skips git ssl verification by exporting `GIT_SSL_NO_VERIFY=true`.
   */
  skip_ssl_verification?: boolean
  /**
   * If specified, the resource will only detect commits that have a tag
   * matching the expression that have been made against the `branch`. Patterns
   * are [glob(7)](http://man7.org/linux/man-pages/man7/glob.7.html) compatible
   * (as in, bash compatible).
   */
  tag_filter?: string
  /**
   * If specified, the resource will only detect commits that have a tag
   * matching the expression that have been made against the `branch`. Patterns
   * are [grep](https://www.gnu.org/software/grep/manual/grep.html) compatible
   * (extended matching enabled, matches entire lines only). Ignored if
   * `tag_filter` is also specified.
   */
  tag_regex?: string
  /**
   * If `true` the flag `--tags` will be used to fetch all tags in the repository.
   * If `false` no tags will be fetched.
   */
  fetch_tags?: boolean
  /**
   * List of credentials for HTTP(s) auth when pulling/pushing private git
   * submodules which are not stored in the same git server as the container
   * repository.
   *
   * Note that `host` is specified with no protocol extensions.
   */
  submodule_credentials?: Array<{
    /**
     * Specified with no protocol extensions.
     */
    host: string
    username?: ConcourseTs.Utils.Var | string
    password?: ConcourseTs.Utils.Var
  }>
  /**
   * If specified as (list of pairs `name` and `value`) it will configure git global
   * options, setting each name with each value.
   *
   * This can be useful to set options like `credential.helper` or similar.
   *
   * See the [git-config(1) manual
   * page](https://www.kernel.org/pub/software/scm/git/docs/git-config.html) for
   * more information and documentation of existing git options.
   */
  git_config?: Record<string, string>
  /**
   * Allows for commits that have been labeled with `[ci skip]` or `[skip ci]`
   * previously to be discovered by the resource.
   */
  disable_ci_skip?: boolean
  /**
   * Array of GPG public keys that the resource will check against to verify the
   * commit (details below).
   */
  commit_verification_keys?: ConcourseTs.Utils.Var[]
  /**
   * Array of GPG public key ids that the resource will check against to verify
   * the commit (details below). The corresponding keys will be fetched from the
   * key server specified in gpg_keyserver. The ids can be short id, long id or
   * fingerprint.
   */
  commit_verification_key_ids?: Array<ConcourseTs.Utils.Var | string>
  /**
   * GPG keyserver to download the public keys from. Defaults to
   * `hkp://keyserver.ubuntu.com/`.
   */
  gpg_keyserver?: ConcourseTs.Utils.Var | string
  /**
   * Base64 encoded [git-crypt](https://github.com/AGWA/git-crypt) key. Setting
   * this will unlock / decrypt the repository with `git-crypt`. To get the key
   * simply execute `git-crypt export-key -- - | base64` in an encrypted
   * repository.
   */
  git_crypt_key?: ConcourseTs.Utils.Var
  /**
   * Information about an HTTPS proxy that will be used to tunnel SSH-based git
   * commands over.
   */
  https_tunnel?: {
    /**
     * The host name or IP of the proxy server
     */
    proxy_host: string
    /**
     * The proxy server's listening port
     */
    proxy_port: string
    /**
     * If the proxy requires authentication, use this username
     */
    proxy_user?: ConcourseTs.Utils.Var | string
    /**
     * If the proxy requires authenticate, use this password
     */
    proxy_password?: ConcourseTs.Utils.Var
  }
  /**
   * Object containing commit message filters
   */
  commit_filter?: {
    /**
     * Array containing strings that should cause a commit to be skipped
     */
    exclude?: string[]
    /**
     * Array containing strings that MUST be included in commit messages for the
     * commit to not be skipped
     *
     * Note: You must escape any regex sensitive characters, since the string is
     * used as a regex filter. For example, using `[skip deploy]` or `[deploy
     * skip]` to skip non-deployment related commits in a deployment pipeline:
     *
     * ```
     * commit_filter:
     *   exclude: ["\\[skip deploy\\]", "\\[deploy skip\\]"]
     * ```
     */
    include?: string[]
  }
  /**
   * The number of versions to return when performing a check
   */
  version_depth?: number
  /**
   * True to search remote refs for the input version when checking out during
   * the get step. This can be useful during the `get` step after a `put` step
   * for unconventional workflows. One example workflow is the
   * `refs/for/<branch>` workflow used by gerrit which 'magically' creates a
   * `refs/changes/nnn` reference instead of the straight forward
   * `refs/for/<branch>` reference that a git remote would usually create. See
   * also `out params.refs_prefix`.
   */
  search_remote_refs?: boolean
}

type PutParamsMerge = {
  rebase?: undefined
  /**
   * If pushing fails with non-fast-forward, continuously attempt to merge
   * remote to local before pushing.
   *
   * Only one of `merge` or `rebase` can be provided, but not both.
   */
  merge?: boolean
}

type PutParamsRebase = {
  /**
   * If pushing fails with non-fast-forward, continuously attempt rebasing and
   * pushing.
   *
   * Only one of `merge` or `rebase` can be provided, but not both.
   */
  rebase?: boolean
  merge?: undefined
}

export type PutParams = (PutParamsMerge | PutParamsRebase) & {
  /**
   * The path of the repository to push to the source.
   */
  repository: string
  /**
   * When passing the merge flag, specify whether the merge commit or the
   * original, unmerged commit should be passed as the output ref. Options are
   * merged and unmerged. Defaults to merged.
   */
  returning?: 'merged' | 'unmerged'
  /**
   * If this is set then HEAD will be tagged. The value should be a path to a
   * file containing the name of the tag.
   */
  tag?: string
  /**
   * When set to 'true' push only the tags of a repo.
   */
  only_tag?: boolean
  /**
   * If specified, the tag read from the file will be prepended with this
   * string. This is useful for adding v in front of version numbers.
   */
  tag_prefix?: string
  /**
   * When set to 'true' this will force the branch to be pushed regardless of
   * the upstream state.
   */
  force?: boolean
  /**
   * If specified the tag will be an
   * [annotated](https://git-scm.com/book/en/v2/Git-Basics-Tagging#Annotated-Tags)
   * tag rather than a
   * [lightweight](https://git-scm.com/book/en/v2/Git-Basics-Tagging#Lightweight-Tags)
   * tag. The value should be a path to a file containing the annotation
   * message.
   */
  annotate?: boolean
  /**
   * If this is set then notes will be added to HEAD to the refs/notes/commits
   * ref. The value should be a path to a file containing the notes.
   */
  notes?: string
  /**
   * The branch to push commits.
   *
   * Note that the version produced by the `put` step will be picked up by
   * subsequent `get` steps even if the `branch` differs from the `branch`
   * specified in the source. To avoid this, you should use two resources of
   * read-only and write-only.
   */
  branch?: string
  /**
   * Allows pushing to refs other than heads. Defaults to `refs/heads`.
   *
   * Useful when paired with `source.search_remote_refs` in cases where the git
   * remote renames the ref you pushed.
   */
  refs_prefix?: string
}

export type GetParams = {
  /**
   * If a positive integer is given, shallow clone the repository using the
   * `--depth` option. To prevent newer commits that do not pass a `paths`
   * filter test from skewing the cloned history away from `version.ref`, this
   * resource will automatically deepen the clone until `version.ref` is found
   * again. It will deepen with exponentially increasing steps until a maximum
   * of 127 + `depth` commits or else resort to unshallow the repository.
   */
  depth?: number
  /**
   * If true the flag --tags will be used to fetch all tags in the repository.
   * If false no tags will be fetched.
   *
   * Will override fetch_tags source configuration if defined.
   */
  fetch_tags?: boolean
  /**
   * If none, submodules will not be fetched. If specified as a list of paths,
   * only the given paths will be fetched. If not specified, or if all is
   * explicitly specified, all submodules are fetched.
   */
  submodules?: string[]
  /**
   * If false, a flat submodules checkout is performed. If not specified, or if
   * true is explicitly specified, a recursive checkout is performed.
   */
  submodule_recursive?: boolean
  /**
   * If true, the submodules are checked out for the specified remote branch
   * specified in the .gitmodules file of the repository. If not specified, or
   * if false is explicitly specified, the tracked sub-module revision of the
   * repository is used to check out the submodules.
   */
  submodule_remote?: boolean
  /**
   * If true, will not fetch Git LFS files.
   */
  disable_git_lfs?: boolean
  /**
   * If true all incoming tags will be deleted. This is useful if you want to
   * push tags, but have reasonable doubts that the tags cached with the
   * resource are outdated. The default value is false.
   */
  clean_tags?: boolean
  /**
   * When populating .git/short_ref use this printf format. Defaults to %s.
   */
  short_ref_format?: string
  /**
   * When populating .git/commit_timestamp use this options to pass to git log
   * --date. Defaults to iso8601.
   */
  timestamp_format?: string
  /**
   * When populating .git/describe_ref use this options to call git describe.
   * Defaults to --always --dirty --broken.
   */
  describe_ref_options?: string
}

export type Resource = ConcourseTs.Resource<Source, PutParams, GetParams>

export type ResourceType = ConcourseTs.ResourceType<
  'registry-image',
  RegistryImage.Source<'concourse/git-resource'>
>
