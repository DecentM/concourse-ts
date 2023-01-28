import { Resource } from '@decentm/concourse-ts'
import { HgResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class HgResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: HgResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
