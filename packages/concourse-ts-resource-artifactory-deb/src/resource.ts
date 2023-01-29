import { Resource, Utils } from '@decentm/concourse-ts'
import { ArtifactoryDebResourceType } from './resource-type'

/**
 * https://github.com/troykinsella/concourse-artifactory-deb-resource
 */
export type Source = {
  /**
   * The URL at which the Debian repository in Artifactory can be located.
   * Example: https://tools.example.com/artifactory/debian-local.
   */
  repository: string
  /**
   * The username with which to access the repository.
   */
  username: Utils.Secret | string
  /**
   * The password with which to access the repository.
   */
  password: Utils.Secret
  /**
   * The target distribution name of the deb package being manipulated. This is
   * the value of the deb.distribution property when puting to Artifactory.
   * Example: bionic.
   */
  distribution: string
  /**
   * The name of the deb package being manipulated.
   */
  package: string
  /**
   * A list of URLs at which GPG keys can be fetched and configured with apt-key
   * add.
   */
  apt_keys?: string[]
  /**
   * Default: amd64. The target architecture of the deb package. Also the value
   * of the deb.architecture property when puting to Artifactory.
   */
  architecture?: string
  /**
   * A boolean indicating if the /etc/apt/sources.list entry generated from
   * these configuration values will be annotated with [trusted=yes].
   */
  trusted?: boolean
  /**
   * Default: pool. The name of the root directory of the repository in which
   * package components can be located.
   */
  components_dir?: string
  /**
   * A list of /etc/apt/source.list entries to include. Useful for when the deb
   * package stored in Artifactory has upstream dependencies. Example: - deb
   * http://archive.ubuntu.com/ubuntu/ bionic main restricted
   */
  other_sources?: string[]
  /**
   * Default: main. The component field in the generated /etc/apt/sources.list
   * entry, as well as the value of the deb.component property when puting to
   * Artifactory.
   */
  component?: string
  /**
   * Instructs check to only observe versions of the configured package matching
   * this regular expression.
   */
  version_pattern?: string
}

export type PutParams = {
  /**
   * The path to a directory containing *.deb files to publish.
   */
  debs: string
  /**
   * A regular expression that matches the main deb package file (the same one
   * represented in the source configuration), from which the version to publish
   * is extracted. Default: ^${package}[_-].*\.deb, where ${package} is the
   * source.package field.
   */
  deb_pattern?: string
}

export type GetParams = {
  /**
   * Default: false. A boolean indicating whether or not deb package archives
   * should be downloaded.
   */
  fetch_archives?: boolean
  /**
   * Default: false. When true, skip apt-get update, populating output files,
   * and fetching archives. This option supersedes fetch_archives. Setting this
   * option can be useful for side-stepping problematic get steps that follow
   * puts.
   */
  skip_all?: boolean
}

export class ArtifactoryDebResource extends Resource<Source, PutParams, GetParams> {
  constructor(
    public override name: string,
    type: ArtifactoryDebResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
