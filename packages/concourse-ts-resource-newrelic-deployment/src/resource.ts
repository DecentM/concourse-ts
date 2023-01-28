import { Resource } from '@decentm/concourse-ts'
import { 22NewrelicDeploymentResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class 22NewrelicDeploymentResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: 22NewrelicDeploymentResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
