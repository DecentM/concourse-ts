import {ResourceType} from '../../components/resource-type'
import {get_duration} from '../../utils'

type SlackTypeSource = {
  repository: string
  tag: string
}

export class Slack extends ResourceType<SlackTypeSource> {
  constructor() {
    super('slack-notification')

    this.type = 'docker-image'

    this.source = {
      repository: 'cfcommunity/slack-notification-resource',
      tag: 'latest',
    }

    this.set_check_every(get_duration({hours: 24}))
  }
}
