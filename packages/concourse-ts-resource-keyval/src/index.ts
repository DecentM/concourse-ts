import * as ConcourseTs from '@decentm/concourse-ts'
import * as RegistryImage from '@decentm/concourse-ts-resource-registry-image'

/**
 * https://github.com/SWCE/keyval-resource
 */
export type Source = Record<string, never>

export type PutParams = {
  /**
   * The properties file to read the key values from
   */
  file: string
}

export type GetParams = Record<string, never>

export type Resource = ConcourseTs.Resource<Source, PutParams, GetParams>

export type ResourceType = ConcourseTs.ResourceType<
  'registry-image' & ConcourseTs.Utils.Identifier,
  RegistryImage.Source<'swce/keyval-resource'>
>
