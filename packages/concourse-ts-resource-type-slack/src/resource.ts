import { Resource } from '@decentm/concourse-ts'
import { SlackResourceType } from './resource-type'

type Source = {
  url: string
  insecure?: boolean
  proxy?: string
  proxy_https_tunnel?: boolean
  disable?: boolean
  ca_certs?: Array<{ domain: string; cert: string }>
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

type Attachment = {
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
  attachments: Attachment[]
}

type PutAttachmentsFile = {
  attachments_file: string
}

/**
 * https://github.com/cloudfoundry-community/slack-notification-resource#parameters
 */
export type PutParams = (
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

export class SlackResource extends Resource<Source, PutParams> {
  constructor(name: string, type: SlackResourceType, source: Source) {
    super(name, type)

    this.source = source
  }
}
