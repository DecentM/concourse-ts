import * as ConcourseTs from '../../../../../src/index'

type SlackTypeSource = {
  repository: string
  tag: string
}

export class Slack extends ConcourseTs.ResourceType<SlackTypeSource> {
  constructor() {
    super('slack-notification')

    this.type = 'docker-image'

    this.source = {
      repository: 'cfcommunity/slack-notification-resource',
      tag: 'latest',
    }
  }
}
