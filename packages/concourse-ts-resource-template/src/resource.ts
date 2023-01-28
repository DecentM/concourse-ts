import { Resource } from '@decentm/concourse-ts'
import { #Template#ResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class #Template#Resource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: #Template#ResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
