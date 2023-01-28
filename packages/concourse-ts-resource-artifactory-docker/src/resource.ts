import { Resource } from '@decentm/concourse-ts'
import { ArtifactoryDockerResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class ArtifactoryDockerResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: ArtifactoryDockerResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
