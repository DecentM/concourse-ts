import { Resource } from '@decentm/concourse-ts'
import { SteampipeResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class SteampipeResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: SteampipeResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
