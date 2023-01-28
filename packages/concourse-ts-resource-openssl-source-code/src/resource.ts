import { Resource } from '@decentm/concourse-ts'
import { OpensslSourceCodeResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class OpensslSourceCodeResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: OpensslSourceCodeResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
