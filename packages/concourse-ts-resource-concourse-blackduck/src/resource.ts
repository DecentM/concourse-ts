import { Resource } from '@decentm/concourse-ts'
import { ConcourseBlackduckResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class ConcourseBlackduckResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: ConcourseBlackduckResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
