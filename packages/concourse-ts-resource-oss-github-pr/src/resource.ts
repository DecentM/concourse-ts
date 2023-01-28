import { Resource } from '@decentm/concourse-ts'
import { OssGithubPrResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class OssGithubPrResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: OssGithubPrResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
