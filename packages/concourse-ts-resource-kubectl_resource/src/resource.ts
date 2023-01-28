import { Resource } from '@decentm/concourse-ts'
import { Kubectl_resourceResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class Kubectl_resourceResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: Kubectl_resourceResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
