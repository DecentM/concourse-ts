import { ResourceType, Type } from '@decentm/concourse-ts'

export type Input = {
  /**
   * https://quay.io/repository/mamercad/concourse-awx-resource?tab=tags&tag=latest
   */
  tag?: string
}

export class AwxResourceType extends ResourceType {
  constructor(name: string, input?: Input, init?: Type.Initer<AwxResourceType>) {
    super(`${name}_type`)

    this.type = 'registry-image'

    this.source = {
      repository: 'quay.io/mamercad/concourse-awx-resource',
      tag: input?.tag ?? 'latest',
    }

    if (init) {
      init(this)
    }
  }
}
