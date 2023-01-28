import { Resource } from '@decentm/concourse-ts'
import { GithubAppTokenResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class GithubAppTokenResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: GithubAppTokenResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
