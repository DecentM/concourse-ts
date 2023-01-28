import { Resource } from '@decentm/concourse-ts'
import { MavenResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class MavenResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: MavenResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
