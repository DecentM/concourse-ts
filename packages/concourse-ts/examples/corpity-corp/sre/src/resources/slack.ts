import * as ConcourseTs from '@decentm/concourse-ts'
import {Slack} from '../resource-types'

type SlackSource = {
  url: string
  insecure?: boolean
  proxy?: string
  proxy_https_tunnel?: boolean
  disable?: boolean
  ca_certs?: Array<{domain: string; cert: string}>
}

type PutText = {
  /**
   * https://github.com/cloudfoundry-community/slack-notification-resource#metadata
   */
  text: string
}

type PutTextFile = {
  text_file: string
}

type SlackAttachment = {
  mrkdwn_in: string[]
  color: string
  pretext: string
  author_name: string
  /**
   * URL
   */
  author_link: string
  /**
   * URL
   */
  author_icon: string
  title: string
  /**
   * URL
   */
  title_link: string
  text: string
  fields: Array<{
    title: string
    value: string
    short: boolean
  }>
  /**
   * URL
   */
  thumb_url: string
  footer: string
  /**
   * URL
   */
  footer_icon: string
  ts: number
}

type PutAttachments = {
  attachments: SlackAttachment[]
}

type PutAttachmentsFile = {
  attachments_file: string
}

/**
 * https://github.com/cloudfoundry-community/slack-notification-resource#parameters
 */
type PutParams = (
  | PutText
  | PutTextFile
  | PutAttachments
  | PutAttachmentsFile
) & {
  channel?: string
  channel_file?: string
  env_file?: string
  username?: string
  icon_url?: string
  icon_emoji?: string
  silent?: boolean
  always_notify?: boolean
}

export class SlackNotification extends ConcourseTs.Resource<
  SlackSource,
  PutParams
> {
  constructor() {
    super('slack', new Slack())

    this.source = {
      url: 'https://hooks.slack.com/services/XXXXX',
    }

    this.set_check_every(ConcourseTs.Utils.get_duration({hours: 1}))
  }

  public install_as_handlers = (
    stepOrJob: ConcourseTs.AnyStep | ConcourseTs.Job
  ) => {
    stepOrJob.add_on_abort(
      this.as_put_step({
        text: 'Pipeline $BUILD_PIPELINE_NAME - manually aborted!\nhttp://ci.corpity-corp.com/builds/$BUILD_ID',
      })
    )

    stepOrJob.add_on_error(
      this.as_put_step({
        text: 'Pipeline $BUILD_PIPELINE_NAME - errored!\nhttp://ci.corpity-corp.com/builds/$BUILD_ID',
      })
    )

    stepOrJob.add_on_failure(
      this.as_put_step({
        text: 'Pipeline $BUILD_PIPELINE_NAME - failure!\nhttp://ci.corpity-corp.com/builds/$BUILD_ID',
      })
    )

    stepOrJob.add_on_success(
      this.as_put_step({
        text: 'Pipeline $BUILD_PIPELINE_NAME - success!\nhttp://ci.corpity-corp.com/builds/$BUILD_ID',
      })
    )
  }
}
