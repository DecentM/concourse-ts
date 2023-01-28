import { Resource } from '@decentm/concourse-ts'
import { IrcNotificationResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class IrcNotificationResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: IrcNotificationResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
