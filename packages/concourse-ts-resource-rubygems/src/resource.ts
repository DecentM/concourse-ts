import { Resource } from '@decentm/concourse-ts'
import { RubygemsResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class RubygemsResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: RubygemsResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
