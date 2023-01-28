import { Resource } from '@decentm/concourse-ts'
import { DatetimeVersionResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class DatetimeVersionResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: DatetimeVersionResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
