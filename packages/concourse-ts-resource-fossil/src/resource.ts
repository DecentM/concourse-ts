import { Resource } from '@decentm/concourse-ts'
import { FossilResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class FossilResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: FossilResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
