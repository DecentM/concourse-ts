import {ResourceType} from '../../components/resource-type'
import {Initer} from '../../declarations/initialisable'

export type SlackInput = {
  tag?: string
}

export class Slack extends ResourceType {
  constructor(name: string, input?: SlackInput, init?: Initer<Slack>) {
    super(`${name}_type`)

    this.type = 'docker-image'

    this.source = {
      repository: 'cfcommunity/slack-notification-resource',
      tag: input?.tag ?? 'latest',
    }

    if (init) {
      init(this)
    }
  }
}
