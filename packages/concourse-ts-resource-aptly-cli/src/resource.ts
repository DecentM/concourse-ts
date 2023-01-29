import { Resource } from '@decentm/concourse-ts'
import { AptlyCliResourceType } from './resource-type'

export type Source = {
  /**
   * URL pointing to the aptly repository's API.
   */
  api_uri: string
  /**
   * URL pointing to the aptly repository.
   */
  repo_uri: string
  /**
   * Repository component the package should be placed in.
   */
  component: string
  /**
   * Distribution that the package is built for.
   */
  distribution: string
  /**
   * Name of the package.
   */
  package: string
}

type PutParamsArchive = {
  /**
   * Path to the package that should be uploaded.
   */
  archive: string
}

type PutParamsArchiveFile = {
  /**
   * Path to the package that should be uploaded.
   */
  archive_file: string
}

export type PutParams = (PutParamsArchive | PutParamsArchiveFile) & {
  /**
   * Path to a file containing the path to the package that should be uploaded.
   */
  gpg_passphrase_file: string
}

export type GetParams = {
  /**
   * Where the downloaded package should be placed.
   */
  archive?: string
}

export class AptlyCliResource extends Resource<Source, PutParams, GetParams> {
  constructor(
    public override name: string,
    type: AptlyCliResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
