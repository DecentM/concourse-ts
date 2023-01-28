import { Resource } from '@decentm/concourse-ts'
import { ConcourseTfeResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class ConcourseTfeResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: ConcourseTfeResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
