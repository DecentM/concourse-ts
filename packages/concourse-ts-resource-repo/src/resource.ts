import { Resource } from '@decentm/concourse-ts'
import { RepoResourceType } from './resource-type'

export type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export type GetParams = {
  // TODO: Fill this out
}

export class RepoResource extends Resource<Source, PutParams, GetParams> {
  constructor(public override name: string, type: RepoResourceType, source: Source) {
    super(name, type)

    this.source = source
  }
}
