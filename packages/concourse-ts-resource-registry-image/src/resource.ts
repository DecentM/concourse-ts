import { Resource, Utils } from '@decentm/concourse-ts'
import { RegistryImageResourceType } from './resource-type'

/**
 * https://github.com/concourse/registry-image-resource#source-configuration
 */
export type Source = {
  /**
   * The URI of the image repository, e.g. `alpine` or `ghcr.io/package/image`.
   * Defaults to checking `docker.io` if no hostname is provided in the URI.
   *
   * *__Note:__
   * If using ecr you only need the repository name, not the full URI e.g.
   * `alpine` not `012345678910.dkr.ecr.us-east-1.amazonaws.com/alpine`. ECR
   * usage is NOT automatically detected. You must set the `aws_region` to tell
   * the resource to automatically use ECR.*
   */
  repository: string
  /**
   * Allow insecure registry.
   */
  insecure?: boolean
  /**
   * Instead of monitoring semver tags, monitor a single tag for changes (based
   * on digest).
   */
  tag?: string
  /**
   * Detect only tags matching this variant suffix, and push version tags with
   * this suffix applied. For example, a value of `stretch` would be used for
   * tags like `1.2.3-stretch`. This is typically used without `tag` - if it is
   * set, this value will only used for pushing, not checking.
   */
  variant?: string
  /**
   * Constrain the returned semver tags according to a semver constraint, e.g.
   * `"~1.2.x"`, `">= 1.2 < 3.0.0 || >= 4.2.3"`. Follows the rules outlined in
   * https://github.com/Masterminds/semver#checking-version-constraints If the
   * value appends with `-0` for pre-release versions, `pre_releases` needs to
   * be `true`.
   */
  semver_constraint?: string
  /**
   * By default, pre-release versions are ignored. With `pre_releases: true`,
   * they will be included.
   *
   * Note however that variants and pre-releases both use
   * the same syntax: `1.2.3-alpine` is technically also valid syntax for a
   * Semver prerelease. For this reason, the resource will only consider
   * prerelease data starting with `alpha`, `beta`, or `rc` as a proper
   * prerelease, treating anything else as a variant.
   */
  pre_releases?: boolean
  /**
   * A username to use when authenticating to the registry. Must be specified
   * for private repos or when using put.
   */
  username?: Utils.Secret | string
  /**
   * A password to use when authenticating to the registry. Must be specified
   * for private repos or when using put.
   */
  password?: Utils.Secret
  /**
   * The access key ID to use for authenticating with ECR.
   */
  aws_access_key_id?: Utils.Secret | string
  /**
   * The secret access key to use for authenticating with ECR.
   */
  aws_secret_access_key?: Utils.Secret
  /**
   * The session token to use for authenticating with STS credentials with ECR.
   */
  aws_session_token?: Utils.Secret
  /**
   * The region to use for accessing ECR. This is required if you are using ECR.
   * This region will help determine the full repository URL you are accessing
   * (e.g., `012345678910.dkr.ecr.us-east-1.amazonaws.com`)
   */
  aws_region?: string
  /**
   * If set, then this role will be assumed before authenticating to ECR. An
   * error will occur if `aws_role_arns` is also specified. This is kept for
   * backward compatibility.
   *
   * @deprecated Use `aws_role_arns`. If you must use this key, cast it to `any`.
   */
  aws_role_arn?: undefined
  /**
   * An array of AWS IAM roles. If set, these roles will be assumed in the
   * specified order before authenticating to ECR. An error will occur if
   * `aws_role_arn` is also specified.
   */
  aws_role_arns?: string[]
  platform?: {
    /**
     * Architecture the image is built for (e.g. `amd64`, `arm64/v8`). If not
     * specified, will default to GOARCH.
     *
     * https://pkg.go.dev/runtime#GOARCH
     * https://pkg.go.dev/internal/goarch#GOARCH
     */
    architecture?: string
    /**
     *  OS the image is built for (e.g. `linux`, `darwin`, `windows`). If not
     *  specified, will default to GOOS.
     *
     * https://pkg.go.dev/runtime#GOOS
     * https://pkg.go.dev/internal/goos#GOOS
     */
    os?: string
  }
  /**
   * If set, progress bars will be disabled and debugging output will be printed
   * instead.
   */
  debug?: boolean
  registry_mirror?: {
    /**
     * A hostname pointing to a Docker registry mirror service. Note that this
     * is only used if no registry hostname prefix is specified in the
     * `repository` key. If the `repository` contains a registry hostname, such
     * as `my-registry.com/foo/bar`, the `registry_mirror` is ignored and the
     * explicitly declared registry in the `repository` key is used.
     */
    host: string
    /**
     * A username to use when authenticating to the mirror.
     */
    username?: Utils.Secret | string
    /**
     * A password to use when authenticating to the mirror.
     */
    password?: Utils.Secret
  }
  content_trust?: {
    /**
     * URL for the notary server. (equal to `DOCKER_CONTENT_TRUST_SERVER`)
     */
    server?: string
    /**
     * Target key's ID used to sign the trusted collection, could be retrieved
     * by `notary key list`
     */
    repository_key_id: Utils.Secret
    /**
     * Target key used to sign the trusted collection.
     */
    repository_key: Utils.Secret
    /**
     * The passphrase of the signing/target key. (equal to
     * `DOCKER_CONTENT_TRUST_REPOSITORY_PASSPHRASE`)
     */
    repository_passphrase: Utils.Secret
    /**
     * TLS key for the notary server.
     */
    tls_key?: Utils.Secret
    /**
     * TLS certificate for the notary server.
     */
    tls_cert?: Utils.Secret
    /**
     * Username for authorize Docker Registry with a Notary
     * server(`content_trust.server`) attached.
     */
    username?: Utils.Secret | string
    /**
     * Password for authorize Docker Registry with a Notary
     * server(`content_trust.server`) attached.
     */
    password?: Utils.Secret
    /**
     * What access for the resources requested
     */
    scopes?: Array<'pull' | 'push,pull' | 'catalog'>
  }
  /**
   * An array of PEM-encoded CA certificates. Example:
   * ```
   * ca_certs: [
   *   `
   *    -----BEGIN CERTIFICATE-----
   *    ...
   *    -----END CERTIFICATE-----
   *   `,
   *   `
   *    -----BEGIN CERTIFICATE-----
   *    ...
   *    -----END CERTIFICATE-----
   *   `
   * ]
   * ```
   *
   * Each entry specifies the x509 CA certificate for the trusted docker
   * registry. This is used to validate the certificate of the docker registry
   * when the registry's certificate is signed by a custom authority (or
   * itself).
   */
  ca_certs?: string[]
}

export type PutParams = {
  /**
   * The path to the `oci` image tarball to upload. Expanded with
   * [`filepath.Glob`](https://golang.org/pkg/path/filepath/#Glob)
   */
  image: string
  /**
   * A version number to use as a tag.
   */
  version?: string
  /**
   * When set to true and version is specified, automatically bump alias tags
   * for the version. For example, when pushing version 1.2.3, push the same
   * image to the following tags:
   *
   *  - `1.2`, if 1.2.3 is the latest version of 1.2.x.
   *  - `1`, if 1.2.3 is the latest version of 1.x.
   *  - `latest`, if 1.2.3 is the latest version overall.
   *
   * If variant is configured as foo, push the same image to the following tags:
   *
   *  - `1.2-foo`, if 1.2.3 is the latest version of 1.2.x with foo.
   *  - `1-foo`, if 1.2.3 is the latest version of 1.x with foo.
   *  - `foo`, if 1.2.3 is the latest version overall for foo.
   *
   * Determining which tags to bump is done by comparing to the existing tags
   * that exist on the registry.
   */
  bump_aliases?: boolean
  /**
   * The path to a file with whitespace-separated list of tag values to tag the
   * image with (in addition to the tag configured in `source`).
   */
  additional_tags?: string
}

export type GetParams = {
  /**
   * The format to fetch the image as.
   */
  format?: 'rootfs' | 'oci'
  /**
   * Skip downloading the image. Useful if you want to trigger a job without
   * using the object or when running after a `put` step and not needing to
   * download the image you just uploaded.
   */
  skip_download?: boolean
}

export class RegistryImageResource extends Resource<Source, PutParams, GetParams> {
  constructor(
    public override name: string,
    type: RegistryImageResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
