import * as ConcourseTs from '@decentm/concourse-ts'

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

    this.set_check_every(ConcourseTs.Utils.get_duration({hours: 24}))
  }
}
