import { Resource } from '@decentm/concourse-ts'
import { NewrelicDeploymentResourceType } from './resource-type'

export type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export type GetParams = {
  // TODO: Fill this out
}

export class NewrelicDeploymentResource extends Resource<
  Source,
  PutParams,
  GetParams
> {
  constructor(
    public override name: string,
    type: NewrelicDeploymentResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
