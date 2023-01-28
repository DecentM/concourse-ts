import { Resource } from '@decentm/concourse-ts'
import { ApacheDirectoryIndexResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class ApacheDirectoryIndexResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: ApacheDirectoryIndexResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
