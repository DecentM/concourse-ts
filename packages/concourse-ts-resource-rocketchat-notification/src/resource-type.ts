import { ResourceType, Type } from '@decentm/concourse-ts'

export type Input = {
  tag?: string
}

export class RocketchatNotificationResourceType extends ResourceType {
  constructor(name: string, input?: Input, init?: Type.Initer<RocketchatNotificationResourceType>) {
    super(`${name}_type`)

    this.type = 'registry-image'

    // TODO: Fill this out
    this.source = {
      repository: '',
      tag: input?.tag ?? '',
    }

    if (init) {
      init(this)
    }
  }
}
