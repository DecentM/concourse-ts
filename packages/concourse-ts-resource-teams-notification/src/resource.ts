import { Resource } from '@decentm/concourse-ts'
import { TeamsNotificationResourceType } from './resource-type'

type Source = {
  // TODO: Fill this out
}

export type PutParams = {
  // TODO: Fill this out
}

export class TeamsNotificationResource extends Resource<Source, PutParams> {
  constructor(
    public override name: string,
    type: TeamsNotificationResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
