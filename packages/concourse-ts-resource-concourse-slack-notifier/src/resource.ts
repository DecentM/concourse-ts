import { Resource } from '@decentm/concourse-ts'
import { ConcourseSlackNotifierResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class ConcourseSlackNotifierResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: ConcourseSlackNotifierResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
