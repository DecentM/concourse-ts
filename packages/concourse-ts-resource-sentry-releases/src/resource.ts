import { Resource } from '@decentm/concourse-ts'
import { SentryReleasesResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class SentryReleasesResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: SentryReleasesResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
