import {ResourceType} from '../../components/resource-type'
import {Initer} from '../../declarations/initialisable'
import {get_duration} from '../../utils'

type SlackTypeSource = {
  repository: string
  tag: string
}

export class Slack extends ResourceType<SlackTypeSource> {
  constructor(name: string, init?: Initer<Slack>) {
    super(`${name}_type`)

    if (init) {
      init(this)
    }

    this.type = 'docker-image'

    this.source = {
      repository: 'cfcommunity/slack-notification-resource',
      tag: 'latest',
    }

    this.set_check_every(get_duration({hours: 24}))
  }
}
