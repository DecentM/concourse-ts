import * as ConcourseTs from '@decentm/concourse-ts'
import * as RegistryImage from '@decentm/concourse-ts-resource-registry-image'

type SourceS3 = {
  /**
   * The driver to use for tracking the version. Determines where the version is stored.
   * The default is 's3'
   */
  driver?: 's3'
  /**
   * The name of the bucket.
   */
  bucket: string
  /**
   * The key to use for the object in the bucket tracking the version.
   */
  key: string
  /**
   * The AWS access key to use when accessing the bucket.
   */
  access_key_id: ConcourseTs.Utils.Secret
  /**
   * The AWS secret key to use when accessing the bucket.
   */
  secret_access_key: ConcourseTs.Utils.Secret
  /**
   * The AWS session token to use when accessing the bucket.
   */
  session_token?: ConcourseTs.Utils.Secret
  /**
   * Default `us-east-1`
   *
   * The region the bucket is in.
   */
  region_name?: string
  /**
   * Custom endpoint for using S3 compatible provider.
   */
  endpoint?: string
  /**
   * Disable SSL for the endpoint, useful for S3 compatible providers without
   * SSL.
   */
  disable_ssl?: boolean
  /**
   * Skip SSL verification for S3 endpoint. Useful for S3 compatible providers
   * using self-signed SSL certificates.
   */
  skip_ssl_verification?: boolean
  /**
   * The server-side encryption algorithm used when storing the version object
   * (e.g. `AES256`, `aws:kms`).
   */
  server_side_encryption?: string
  /**
   * Use v2 signing, default false.
   */
  use_v2_signing?: boolean
}

type SourceGit = {
  /**
   * The driver to use for tracking the version. Determines where the version is
   * stored.
   */
  driver: 'git'
  /**
   * The repository URL.
   */
  uri: string
  /**
   * The branch the file lives on.
   */
  branch: string
  /**
   * The name of the file in the repository.
   */
  file: string
  /**
   * The SSH private key to use when pulling from/pushing to to the repository.
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
   * The git identity to use when pushing to the repository support RFC 5322
   * address of the form "Gogh Fir \<gf@example.com\>" or "foo@example.com".
   */
  git_user?: string | ConcourseTs.Utils.Secret
  /**
   * If a positive integer is given, shallow clone the repository using the
   * --depth option.
   */
  depth?: number
  /**
   * Skip SSL verification for git endpoint. Useful for git compatible providers
   * using self-signed SSL certificates.
   */
  skip_ssl_verification?: boolean
  /**
   * If specified overides the default commit message with the one provided. The
   * user can use `%version%` and `%file%` to get them replaced automatically
   * with the correct values.
   */
  commit_message?: string
}

type SourceSwift = {
  /**
   * The driver to use for tracking the version. Determines where the version is
   * stored.
   */
  driver: 'swift'
  /**
   * All openstack configuration must go under this key.
   */
  openstack: {
    /**
     * The name of the container.
     */
    container: string
    /**
     * The item name to use for the object in the container tracking the version.
     */
    item_name: string
    /**
     * The region the container is in.
     */
    region: string

    // https://github.com/rackspace/gophercloud/blob/master/auth_options.go

    /**
     * Specifies the HTTP endpoint that is required to work with the Identity
     * API of the appropriate version. While it's ultimately needed by all of
     * the identity services, it will often be populated by a provider-level
     * function.
     */
    identity_endpoint?: string
    /**
     * Required if using Identity V2 API. Consult with your provider's control
     * panel to discover your account's username. In Identity V3, either UserID
     * or a combination of Username and DomainID or DomainName are needed.
     */
    username?: string | ConcourseTs.Utils.Secret
    /**
     * In Identity V3, either UserID or a combination of Username and DomainID
     * or DomainName are needed.
     */
    user_id?: string | ConcourseTs.Utils.Secret
    /**
     * Exactly one of Password or APIKey is required for the Identity V2 and V3
     * APIs. Consult with your provider's control panel to discover your
     * account's preferred method of authentication.
     */
    password?: ConcourseTs.Utils.Secret
    /**
     * Exactly one of Password or APIKey is required for the Identity V2 and V3
     * APIs. Consult with your provider's control panel to discover your
     * account's preferred method of authentication.
     */
    api_key?: ConcourseTs.Utils.Secret
    /**
     * At most one of DomainID and DomainName must be provided if using Username
     * with Identity V3. Otherwise, either are optional.
     */
    domain_id?: string | ConcourseTs.Utils.Secret
    /**
     * At most one of DomainID and DomainName must be provided if using Username
     * with Identity V3. Otherwise, either are optional.
     */
    domain_name?: string
    /**
     * Optional for the Identity V2 API. Some providers allow you to specify a
     * TenantName instead of the TenantId. Some require both. Your provider's
     * authentication policies will determine how these fields influence
     * authentication.
     */
    tenant_id?: string | ConcourseTs.Utils.Secret
    /**
     * Optional for the Identity V2 API. Some providers allow you to specify a
     * TenantName instead of the TenantId. Some require both. Your provider's
     * authentication policies will determine how these fields influence
     * authentication.
     */
    tenant_name?: string
    /**
     * Should be set to true if you grant permission for Gophercloud to cache
     * your credentials in memory, and to allow Gophercloud to attempt to
     * re-authenticate automatically if/when your token expires.  If you set it
     * to false, it will not cache these settings, but re-authentication will
     * not be possible. This setting defaults to false.
     *
     * NOTE: The reauth function will try to re-authenticate endlessly if left
     * unchecked. The way to limit the number of attempts is to provide a custom
     * HTTP client to the provider client and provide a transport that
     * implements the RoundTripper interface and stores the number of failed
     * retries. For an example of this, see here:
     * https://github.com/rackspace/rack/blob/1.0.0/auth/clients.go#L311
     */
    allow_reauth?: boolean
    /**
     * Allows users to authenticate (possibly as another user) with an
     * authentication token ID.
     */
    token_id?: string | ConcourseTs.Utils.Secret
  }
}

type SourceGcs = {
  /**
   * The driver to use for tracking the version. Determines where the version is
   * stored.
   */
  driver: 'gcs'
  /**
   * The name of the bucket.
   */
  bucket: string
  /**
   * The key to use for the object in the bucket tracking the version.
   */
  key: string
  /**
   * The contents of your GCP Account JSON Key. Example:
   *
   * ```yaml
   * json_key: |
   *   {
   *     "private_key_id": "...",
   *     "private_key": "...",
   *     "client_email": "...",
   *     "client_id": "...",
   *     "type": "service_account"
   *   }
   * ```
   */
  json_key: string
}

export type Source = (SourceS3 | SourceGit | SourceSwift | SourceGcs) & {
  /**
   * The version number to use when bootstrapping, i.e. when there is not a
   * version number present in the source.
   */
  initial_version?: string
}

type VersionSemantic = 'major' | 'minor' | 'patch' | 'final'

type BumpPre = {
  /**
   * Modifies the version that gets provided to the build. An output must be
   * explicitly specified to actually update the version.
   */
  bump?: VersionSemantic
  /**
   * Modifies the version that gets provided to the build. An output must be
   * explicitly specified to actually update the version.
   */
  pre?: VersionSemantic
}

export type GetParams = BumpPre & {
  /**
   * By default `false`, once it's set to `true` then PreRelease will be bumped
   * without a version number.
   */
  pre_without_version?: boolean
}

type PutParamsFile = {
  /**
   * Path to a file containing the version number to set.
   */
  file: string
}

export type PutParams = (BumpPre | PutParamsFile) & {
  /**
   * By default `false`, once it's set to `true` then PreRelease will be bumped
   * without a version number.
   */
  pre_without_version?: boolean
  /**
   * See [Check-less
   * Usage](https://github.com/concourse/semver-resource/blob/master/README.md#check-less-usage).
   */
  get_latest?: boolean
}

export type Resource = ConcourseTs.Resource<Source, PutParams, GetParams>

export type ResourceType = ConcourseTs.ResourceType<
  'registry-image',
  RegistryImage.Source<'concourse/semver-resource'>
>
