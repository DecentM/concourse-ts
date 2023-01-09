import {Resource} from '../../components/resource'
import {get_duration} from '../../utils'
import {RegistryImage} from '../resource-types'

/**
 * https://github.com/concourse/registry-image-resource#source-configuration
 */
type SourceType = {
  repository: string
  insecure?: boolean
  tag?: string
  variant?: string
  semver_constraint?: string
  username?: string
  password?: string
  aws_access_key_id?: string
  aws_secret_access_key?: string
  aws_session_token?: string
  aws_region?: string
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
    username?: string
    password?: string
  }
  content_trust?: {
    server?: string
    repository_key_id: string
    repository_key: string
    repository_passphrase: string
    tls_key?: string
    tls_cert?: string
    username?: string
    password?: string
    scopes?: ('pull' | 'push,pull' | 'catalog')[]
  }
  ca_certs?: string[]
}

export class PrivateQuayImage extends Resource<SourceType> {
  constructor(name: string) {
    super(name, new RegistryImage())

    this.set_check_every(get_duration({minutes: 1}))

    this.icon = 'ferry'
  }
}

export class PublicDockerHubImage extends Resource<SourceType> {
  constructor(name: string, source: SourceType) {
    super(name, new RegistryImage())

    this.set_check_every(get_duration({minutes: 15}))

    this.source = source
  }
}
