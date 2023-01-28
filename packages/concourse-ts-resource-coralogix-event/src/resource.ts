import { Resource } from '@decentm/concourse-ts'
import { CoralogixEventResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class CoralogixEventResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: CoralogixEventResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
