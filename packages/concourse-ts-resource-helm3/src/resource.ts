import { Resource } from '@decentm/concourse-ts'
import { Helm3ResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class Helm3Resource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: Helm3ResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
