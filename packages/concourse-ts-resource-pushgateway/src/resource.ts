import { Resource } from '@decentm/concourse-ts'
import { PushgatewayResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class PushgatewayResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: PushgatewayResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
