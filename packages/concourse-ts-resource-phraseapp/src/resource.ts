import { Resource } from '@decentm/concourse-ts'
import { PhraseappResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class PhraseappResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: PhraseappResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
