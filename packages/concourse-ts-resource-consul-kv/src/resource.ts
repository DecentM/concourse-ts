import { Resource } from '@decentm/concourse-ts'
import { ConsulKvResourceType } from './resource-type'

export type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export type GetParams = {
  // TODO: Fill this out
}

export class ConsulKvResource extends Resource<Source, PutParams, GetParams> {
  constructor(
    public override name: string,
    type: ConsulKvResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
