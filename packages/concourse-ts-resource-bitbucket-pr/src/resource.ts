import { Resource } from '@decentm/concourse-ts'
import { BitbucketPrResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class BitbucketPrResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: BitbucketPrResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
