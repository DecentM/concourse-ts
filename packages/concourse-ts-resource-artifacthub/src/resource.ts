import { Resource } from '@decentm/concourse-ts'
import { ArtifacthubResourceType } from './resource-type'

export type Source = {
  /**
   * the repository name of the package
   */
  repository_name: string
  /**
   * the package name
   */
  package_name: string
  /**
   * an api key
   */
  api_key?: string
}

export type PutParams = never

export type GetParams = Record<string, never>

export class ArtifacthubResource extends Resource<Source, PutParams, GetParams> {
  constructor(
    public override name: string,
    type: ArtifacthubResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
