import { Resource } from '@decentm/concourse-ts'
import { K8sResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class K8sResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: K8sResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
