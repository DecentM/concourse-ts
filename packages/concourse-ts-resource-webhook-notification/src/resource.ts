import { Resource } from '@decentm/concourse-ts'
import { WebhookNotificationResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class WebhookNotificationResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: WebhookNotificationResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
