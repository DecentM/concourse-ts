import { Resource } from '@decentm/concourse-ts'
import { HttpJqResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class HttpJqResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: HttpJqResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
