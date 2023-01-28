import { Resource } from '@decentm/concourse-ts'
import { DockerImageResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class DockerImageResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: DockerImageResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
