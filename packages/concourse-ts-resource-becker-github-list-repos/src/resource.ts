import { Resource } from '@decentm/concourse-ts'
import { BeckerGithubListReposResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class BeckerGithubListReposResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: BeckerGithubListReposResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
