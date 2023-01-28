import { Resource } from '@decentm/concourse-ts'
import { PaasGrafanaAnnotationResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class PaasGrafanaAnnotationResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: PaasGrafanaAnnotationResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
