import { Resource } from '@decentm/concourse-ts'
import { Sonarqube.yamlResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class Sonarqube.yamlResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: Sonarqube.yamlResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
