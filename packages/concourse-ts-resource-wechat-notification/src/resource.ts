import { Resource } from '@decentm/concourse-ts'
import { WechatNotificationResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class WechatNotificationResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: WechatNotificationResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
