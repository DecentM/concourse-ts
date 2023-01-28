import { Resource } from '@decentm/concourse-ts'
import { CogitoResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class CogitoResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: CogitoResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
