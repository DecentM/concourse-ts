import { Resource } from '@decentm/concourse-ts'
import { ApacheDirectoryIndexResourceType } from './resource-type'

/**
 * https://github.com/cloudlena/apache-directory-index-resource
 */
export type Source = {
  /**
   * The path of where the your versioned folders reside
   */
  directory: string
  /**
   * Describes the pattern of how the folders are named (use $VERSION as a
   * placeholder for the version)
   */
  folder_pattern: string
  /**
   * Describes the pattern of where the file resides and how it's named (use
   * $VERSION as a placeholder for the version)
   */
  file_pattern: string
  /**
   * If true then the downloaded file will be expanded into the "expanded"
   * directory
   */
  expand?: boolean
}

export type PutParams = never

/**
 * No get params, pass an empty object
 */
export type GetParams = Record<string, never>

export class ApacheDirectoryIndexResource extends Resource<
  Source,
  PutParams,
  GetParams
> {
  constructor(
    public override name: string,
    type: ApacheDirectoryIndexResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
