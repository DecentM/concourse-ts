import {Resource} from '../../components/resource'
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
export type SlackPutParams = (
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

export class SlackNotification extends Resource<SlackSource, SlackPutParams> {
  constructor(name: string, source: SlackSource) {
    super(name, new Slack(`${name}_resource`))

    this.source = source
  }
}
