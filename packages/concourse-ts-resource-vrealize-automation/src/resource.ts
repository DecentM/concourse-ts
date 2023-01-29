import { Resource } from '@decentm/concourse-ts'
import { VrealizeAutomationResourceType } from './resource-type'

export type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export type GetParams = {
  // TODO: Fill this out
}

export class VrealizeAutomationResource extends Resource<
  Source,
  PutParams,
  GetParams
> {
  constructor(
    public override name: string,
    type: VrealizeAutomationResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
