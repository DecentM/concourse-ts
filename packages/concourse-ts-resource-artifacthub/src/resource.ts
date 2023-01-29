import { Resource } from '@decentm/concourse-ts'
import { ArtifacthubResourceType } from './resource-type'

export type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export type GetParams = {
  // TODO: Fill this out
}

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
