import { Resource } from '@decentm/concourse-ts'
import { CfCliResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class CfCliResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: CfCliResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
