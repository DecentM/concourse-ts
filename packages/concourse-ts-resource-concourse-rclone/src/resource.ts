import { Resource } from '@decentm/concourse-ts'
import { ConcourseRcloneResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class ConcourseRcloneResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: ConcourseRcloneResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
