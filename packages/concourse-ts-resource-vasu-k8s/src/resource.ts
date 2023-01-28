import { Resource } from '@decentm/concourse-ts'
import { VasuK8sResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class VasuK8sResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: VasuK8sResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
