import { Resource } from '@decentm/concourse-ts'
import { ConcourseSonarqubeNotifierResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class ConcourseSonarqubeNotifierResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: ConcourseSonarqubeNotifierResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
