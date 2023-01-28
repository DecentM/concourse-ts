import { Resource } from '@decentm/concourse-ts'
import { Incident.yamlResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class Incident.yamlResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: Incident.yamlResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
