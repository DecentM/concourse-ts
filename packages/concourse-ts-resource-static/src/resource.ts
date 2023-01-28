import { Resource } from '@decentm/concourse-ts'
import { StaticResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class StaticResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: StaticResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
