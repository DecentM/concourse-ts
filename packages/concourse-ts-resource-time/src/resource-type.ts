import { ResourceType, Type } from '@decentm/concourse-ts'

export type Input = {
  /**
   * https://hub.docker.com/r/concourse/time-resource/tags
   */
  tag?: string
}

export class TimeResourceType extends ResourceType {
  constructor(name: string, input?: Input, init?: Type.Initer<TimeResourceType>) {
    super(`${name}_type`)

    this.type = 'registry-image'

    this.source = {
      repository: 'concourse/time-resource',
      tag: input?.tag ?? 'latest',
    }

    if (init) {
      init(this)
    }
  }
}
