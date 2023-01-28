import { Resource } from '@decentm/concourse-ts'
import { BeckerDhallResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class BeckerDhallResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: BeckerDhallResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
