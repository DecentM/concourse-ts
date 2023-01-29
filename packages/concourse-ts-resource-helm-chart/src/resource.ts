import { Resource } from '@decentm/concourse-ts'
import { HelmChartResourceType } from './resource-type'

export type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export type GetParams = {
  // TODO: Fill this out
}

export class HelmChartResource extends Resource<Source, PutParams, GetParams> {
  constructor(
    public override name: string,
    type: HelmChartResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
