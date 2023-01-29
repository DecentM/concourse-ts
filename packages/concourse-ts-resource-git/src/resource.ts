import { Resource } from '@decentm/concourse-ts'
import { GitResourceType } from './resource-type'

export type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export type GetParams = {
  // TODO: Fill this out
}

export class GitResource extends Resource<Source, PutParams, GetParams> {
  constructor(public override name: string, type: GitResourceType, source: Source) {
    super(name, type)

    this.source = source
  }
}
