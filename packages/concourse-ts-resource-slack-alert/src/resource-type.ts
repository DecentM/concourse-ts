import { ResourceType, Type } from '@decentm/concourse-ts'

export type Input = {
  /**
   * https://hub.docker.com/r/arbourd/concourse-slack-alert-resource/tags
   */
  tag?: string
}

export class SlackAlertResourceType extends ResourceType {
  constructor(
    name: string,
    input?: Input,
    init?: Type.Initer<SlackAlertResourceType>
  ) {
    super(`${name}_type`)

    this.type = 'registry-image'

    this.source = {
      repository: 'arbourd/concourse-slack-alert-resource',
      tag: input?.tag ?? 'latest',
    }

    if (init) {
      init(this)
    }
  }
}
