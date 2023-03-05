import * as ConcourseTs from '@decentm/concourse-ts'
import * as RegistryImage from '@decentm/concourse-ts-resource-registry-image'

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

export type Resource = ConcourseTs.Resource<Source, PutParams, GetParams>

export type ResourceType = ConcourseTs.ResourceType<
  'registry-image' & ConcourseTs.Utils.Identifier,
  RegistryImage.Source<'mastertinner/apache-directory-index-resource'>
>
