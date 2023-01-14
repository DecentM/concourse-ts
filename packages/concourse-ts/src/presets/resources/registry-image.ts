import {Resource} from '../../components/resource'
import {Secret} from '../../utils'
import {RegistryImage as RegistryImageType} from '../resource-types'

/**
 * https://github.com/concourse/registry-image-resource#source-configuration
 */
type SourceType = {
  repository: string
  insecure?: boolean
  tag?: string
  variant?: string
  semver_constraint?: string
  username?: Secret
  password?: Secret
  aws_access_key_id?: Secret
  aws_secret_access_key?: Secret
  aws_session_token?: Secret
  aws_region?: string
  /**
   * @deprecated Use `aws_role_arns`
   */
  aws_role_arn?: string
  aws_role_arns?: string[]
  platform?: {
    /**
     * https://pkg.go.dev/runtime#GOARCH
     * https://pkg.go.dev/internal/goarch#GOARCH
     */
    architecture?: string
    /**
     * https://pkg.go.dev/runtime#GOOS
     * https://pkg.go.dev/internal/goos#GOOS
     */
    os?: string
  }
  debug?: boolean
  registry_mirror?: {
    host: string
    username?: Secret
    password?: Secret
  }
  content_trust?: {
    server?: string
    repository_key_id: Secret
    repository_key: Secret
    repository_passphrase: Secret
    tls_key?: Secret
    tls_cert?: Secret
    username?: Secret
    password?: Secret
    scopes?: ('pull' | 'push,pull' | 'catalog')[]
  }
  ca_certs?: string[]
}

/**
 * https://github.com/concourse/registry-image-resource#put-steps-params
 */
type PutParams = {
  image: string
  version?: string
  bump_aliases?: boolean
  additional_tags?: string
}

/**
 * https://github.com/concourse/registry-image-resource#get-step-params
 */
type GetParams = {
  format?: 'rootfs' | 'oci'
  skip_download?: boolean
}

export class RegistryImage extends Resource<SourceType, PutParams, GetParams> {
  constructor(name: string, source: SourceType) {
    super(name, new RegistryImageType(`${name}_resource`))

    this.source = source
  }
}
