import { Resource } from '@decentm/concourse-ts'
import { IoArtifactoryResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class IoArtifactoryResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: IoArtifactoryResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
