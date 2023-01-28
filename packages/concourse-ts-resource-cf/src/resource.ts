import { Resource } from '@decentm/concourse-ts'
import { CfResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class CfResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: CfResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
