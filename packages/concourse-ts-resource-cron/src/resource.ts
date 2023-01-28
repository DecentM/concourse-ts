import { Resource } from '@decentm/concourse-ts'
import { CronResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class CronResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: CronResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
