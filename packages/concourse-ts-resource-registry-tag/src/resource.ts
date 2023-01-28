import { Resource } from '@decentm/concourse-ts'
import { RegistryTagResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class RegistryTagResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: RegistryTagResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
