import { Resource } from '@decentm/concourse-ts'
import { DatadogEventResourceType } from './resource-type'

export type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export type GetParams = {
  // TODO: Fill this out
}

export class DatadogEventResource extends Resource<Source, PutParams, GetParams> {
  constructor(
    public override name: string,
    type: DatadogEventResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
