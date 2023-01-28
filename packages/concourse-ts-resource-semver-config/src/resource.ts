import { Resource } from '@decentm/concourse-ts'
import { SemverConfigResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class SemverConfigResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: SemverConfigResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
