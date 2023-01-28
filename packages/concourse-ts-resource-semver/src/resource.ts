import { Resource } from '@decentm/concourse-ts'
import { SemverResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class SemverResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: SemverResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
