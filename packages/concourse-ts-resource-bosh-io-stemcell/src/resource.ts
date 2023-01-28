import { Resource } from '@decentm/concourse-ts'
import { BoshIoStemcellResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class BoshIoStemcellResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: BoshIoStemcellResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
