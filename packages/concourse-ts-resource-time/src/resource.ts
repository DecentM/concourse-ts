import { Resource } from '@decentm/concourse-ts'
import { TimeResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class TimeResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: TimeResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
