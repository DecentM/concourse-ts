import { Resource } from '@decentm/concourse-ts'
import { FlyResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class FlyResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: FlyResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
