import { Resource } from '@decentm/concourse-ts'
import { HipchatNotificationResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class HipchatNotificationResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: HipchatNotificationResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
