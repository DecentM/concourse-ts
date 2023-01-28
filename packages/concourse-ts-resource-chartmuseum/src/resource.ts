import { Resource } from '@decentm/concourse-ts'
import { ChartmuseumResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class ChartmuseumResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: ChartmuseumResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
