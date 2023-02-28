import * as ConcourseTs from '@decentm/concourse-ts'
import * as RegistryImage from '@decentm/concourse-ts-resource-registry-image'

/**
 * https://github.com/concourse/pool-resource
 */
export type Source = {
  /**
   * The location of the repository.
   */
  uri: string
  /**
   * The branch to track.
   */
  branch: string
  /**
   * The logical name of your pool of things to lock.
   */
  pool: string
  /**
   * Private key to use when pulling/pushing. Ensure it does not require a
   * password.
   *
   * Example:
   * ```
   * private_key: |
   *   -----BEGIN RSA PRIVATE KEY-----
   *   MIIEowIBAAKCAQEAtCS10/f7W7lkQaSgD/mVeaSOvSF9ql4hf/zfMwfVGgHWjj+W
   *   <Lots more text>
   *   DWiJL+OFeg9kawcUL6hQ8JeXPhlImG6RTUffma9+iGQyyBMCGd1l
   *   -----END RSA PRIVATE KEY-----
   * ```
   */
  private_key?: ConcourseTs.Utils.Secret
  /**
   * Username for HTTP(S) auth when pulling/pushing. This is needed when only
   * HTTP/HTTPS protocol for git is available (which does not support private
   * key auth) and auth is required.
   */
  username?: string | ConcourseTs.Utils.Secret
  /**
   * Password for HTTP(S) auth when pulling/pushing.
   */
  password?: ConcourseTs.Utils.Secret
  /**
   * If specified as (list of pairs `name` and `value`) it will configure git
   * global options, setting each name with each value. This can be useful to
   * set options like `credential.helper` or similar. See the [`git-config(1)`
   * manual
   * page](https://www.kernel.org/pub/software/scm/git/docs/git-config.html) for
   * more information and documentation of existing git options.
   */
  git_config?: Array<{ name: string; value: string }>
  /**
   * If specified, dictates how long to wait until retrying to acquire a lock or
   * release a lock. The default is 10 seconds. Valid values: `60s`, `90m`,
   * `1h`.
   */
  retry_delay?: ConcourseTs.Utils.Duration
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
    proxy_port: number
    /**
     * If the proxy requires authentication, use this username
     */
    proxy_user?: string | ConcourseTs.Utils.Secret
    /**
     * If the proxy requires authentication, use this password
     */
    proxy_password?: ConcourseTs.Utils.Secret
  }
}

export type GetParams = {
  /**
   * If a positive integer is given, *shallow* clone the repository using the
   * `--depth` option.
   */
  depth?: number
}

type PutParamsAcquire = {
  /**
   * If true, we will attempt to move a randomly chosen lock from the pool's
   * unclaimed directory to the claimed directory. Acquiring will retry until a
   * lock becomes available.
   */
  acquire: boolean
}

type PutParamsClaim = {
  /**
   * If set, the specified lock from the pool will be acquired, rather than a
   * random one (as in `acquire`). Like `acquire`, claiming will retry until the
   * specific lock becomes available.
   */
  claim: string
}

type PutParamsRelease = {
  /**
   * If set, we will release the lock by moving it from claimed to unclaimed. The
   * value is the path of the lock to release (a directory containing `name` and
   * `metadata`), which typically is just the step that provided the lock (either
   * a `get` to pass one along or a `put` to acquire).
   *
   * Note: the lock must be available in your job before you can release it. In
   * other words, a `get` step to fetch metadata about the lock is necessary
   * before a `put` step can release the lock.
   */
  release: string
}

type PutParamsAdd = {
  /**
   *  If set, we will add a new lock to the pool in the unclaimed state. The value
   *  is the path to a directory containing the files `name` and `metadata` which
   *  should contain the name of your new lock and the contents you would like in
   *  the lock, respectively.
   */
  add: string
}

type PutParamsAddClaimed = {
  /**
   * Exactly the same as the `add` param, but adds a lock to the pool in the
   * *claimed* state.
   */
  add_claimed: string
}

type PutParamsRemove = {
  /**
   * If set, we will remove the given lock from the pool. The value is the same as
   * `release`. This can be used for e.g. tearing down an environment, or moving a
   * lock between pools by using `add` with a different pool in a second step.
   */
  remove: string
}

type PutParamsUpdate = {
  /**
   * If set, we will update an existing lock in the pool.
   *
   * * If the existing lock is in the unclaimed state we will update it with the
   *   contents of the `metadata` file.
   * * If no such lock is present in either the claimed or unclaimed state we add a
   *   new lock to the pool in the unclaimed state.
   * * If the lock is in the claimed state we will wait for it to be unclaimed and
   *   proceed to update it as above.
   *
   * The value is the path to a directory containing the files `name` and
   * `metadata` which should contain the name of your new lock and the contents you
   * would like in the lock, respectively.
   */
  update: string
}

type PutParamsCheck = {
  /**
   * If set, we will check for an existing claimed lock in the pool and wait
   * until it becomes unclaimed.
   *
   * * If there is an existing lock in claimed state: wait until lock is unclaimed
   * * If there is an existing lock in unclaimed state: no-op
   * * If no lock exists: fail
   *
   * The purpose is to simply block until a given lock in a pool is moved from a
   * claimed state to an unclaimed state. This functionality allows us to build
   * dependencies between disparate pipelines without the need to `acquire`
   * locks.
   *
   * Note: the lock must be present to perform a check. In other words, a `get`
   * step to fetch metadata about the lock is necessary before a `put` step can
   * check the existence of the lock.
   */
  check: string
}

export type PutParams =
  | PutParamsAcquire
  | PutParamsAdd
  | PutParamsAddClaimed
  | PutParamsCheck
  | PutParamsClaim
  | PutParamsRelease
  | PutParamsRemove
  | PutParamsUpdate

export type Resource = ConcourseTs.Resource<Source, PutParams, GetParams>

export type ResourceType = ConcourseTs.ResourceType<
  'registry-image',
  RegistryImage.Source<'concourse/pool-resource'>
>
