import { Resource, Utils, Type } from '@decentm/concourse-ts'
import { ArtifactoryResourceType } from './resource-type'

type SourceBase = {
  /**
   * The URI of the artifactory server
   */
  uri: string
  /**
   * The artifactory username
   */
  username: Utils.Secret | string
  /**
   * The artifactory password
   */
  password: Utils.Secret
  /**
   * The name of the build
   */
  build_name: Type.BuildMetadata | string
}

type SourceNoProxy = SourceBase & {
  proxy_host?: undefined
}

type SourceProxy = SourceBase & {
  /**
   * The fully qualified domain name of the HTTP proxy through which the artifactory server is reachable
   */
  proxy_host: string
  /**
   * The proxy port (required when proxy_host is specified)
   */
  proxy_port: number
}

/**
 * https://github.com/spring-io/artifactory-resource
 */
export type Source = SourceProxy | SourceNoProxy

type AntPatterns = {
  /**
   * A list of Ant style patterns for the files to include.
   */
  include?: string[]
  /**
   * A list of Ant style patterns for the files to exclude.
   */
  exclude?: string[]
}

type ArtifactSetItem = AntPatterns & {
  /**
   * A map of name/value pairs that will be added as properties to the
   * deployed artifacts.
   */
  properties: Record<string, Type.YamlValue>
}

export type PutParams = AntPatterns & {
  /**
   * If additional debug output should be logged.
   */
  debug?: boolean
  /**
   * The artifact repository to deploy to (e.g.
   * libs-snapshot-local).
   */
  repo: string
  /**
   * The build number to save (if not specified, an ID based on the current
   * date/time will be used).
   */
  build_number?: Type.BuildMetadata | string
  /**
   * The folder to save.
   */
  folder?: string
  /**
   * The module layout (maven or none) used to generate build-info module
   * information (defaults to maven).
   */
  module_layout?: 'maven' | 'none'
  /**
   * The URL back to the concourse build (e.g.
   * https://my.concourse.url/builds/${BUILD_ID}).
   */
  build_uri?: string
  /**
   * A path to a UTF-8 file containing properties that should be copied into
   * the Build-Info properties section.
   */
  build_properties?: string
  /**
   * If snapshot timestamps should be removed to allow artifactory to generate
   * them (defaults to true).
   */
  strip_snapshot_timestamps?: boolean
  /**
   * If checksum based uploads should be disabled (useful to prevent
   * artifactory from associating the wrong resource with a snapshot version).
   */
  disable_checksum_uploads?: boolean
  /**
   * Number of threads to use when deploying artifacts (defaults to 1).
   */
  threads?: number
  /**
   * A PGP/GPG signing key that will be used to sign artifacts (can be the key
   * content or a reference to a file containing the key).
   */
  signing_key?: string
  /**
   * The passphrase used to unlock the key.
   */
  signing_passphrase?: string
  /**
   * Additional configuration for a subset of the artifacts (see below).
   */
  artifact_set: ArtifactSetItem[]
}

export type GetParams = {
  /**
   *  If additional debug output should be logged.
   */
  debug?: boolean
  /**
   * If maven meta-data should be generated. This is required if you wish to use
   * timestamp based SNAPSHOT artifacts with Maven.
   */
  generate_maven_metadata?: boolean
  /**
   *  If the build-info.json provided by artifactory should be saved.
   */
  save_build_info?: boolean
  /**
   * If artifacts should be downloaded or skipped. If you only need
   * build-info.json you can set this to false.
   */
  download_artifacts?: boolean
  /**
   * If artifact checksum files should be downloaded (default true).
   */
  download_checksums?: boolean
  /**
   * Number of threads to use when downloading artifacts (default 1).
   */
  threads?: number
}

export class ArtifactoryResource extends Resource<Source, PutParams, GetParams> {
  constructor(
    public override name: string,
    type: ArtifactoryResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
