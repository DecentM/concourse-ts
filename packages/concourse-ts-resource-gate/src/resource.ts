import { Resource } from '@decentm/concourse-ts'
import { GateResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class GateResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: GateResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
