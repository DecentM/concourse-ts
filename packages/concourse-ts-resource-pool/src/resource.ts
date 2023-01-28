import { Resource } from '@decentm/concourse-ts'
import { PoolResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class PoolResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: PoolResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
