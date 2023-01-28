import { Resource } from '@decentm/concourse-ts'
import { ArtifactoryResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class ArtifactoryResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: ArtifactoryResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
