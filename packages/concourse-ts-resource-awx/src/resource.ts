import { Resource } from '@decentm/concourse-ts'
import { AwxResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class AwxResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: AwxResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
