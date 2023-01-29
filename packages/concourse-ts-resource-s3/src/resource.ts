import { Resource } from '@decentm/concourse-ts'
import { S3ResourceType } from './resource-type'

export type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export type GetParams = {
  // TODO: Fill this out
}

export class S3Resource extends Resource<Source, PutParams, GetParams> {
  constructor(public override name: string, type: S3ResourceType, source: Source) {
    super(name, type)

    this.source = source
  }
}
