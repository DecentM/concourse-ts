import { Resource } from '@decentm/concourse-ts'
import { LastpassResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class LastpassResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: LastpassResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
