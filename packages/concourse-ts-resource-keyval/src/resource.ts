import { Resource } from '@decentm/concourse-ts'
import { KeyvalResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class KeyvalResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: KeyvalResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
