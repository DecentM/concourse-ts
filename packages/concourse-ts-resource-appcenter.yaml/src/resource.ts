import { Resource } from '@decentm/concourse-ts'
import { Appcenter.yamlResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class Appcenter.yamlResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: Appcenter.yamlResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
