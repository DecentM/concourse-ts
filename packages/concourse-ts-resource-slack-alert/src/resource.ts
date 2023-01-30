import { Resource, Type, Utils } from '@decentm/concourse-ts'
import { SlackAlertResourceType } from './resource-type'

export type Source = {
  /**
   * Slack webhook URL.
   */
  url: string
  /**
   * Target channel where messages are posted. If unset the default channel of
   * the webhook is used.
   */
  channel?: string
  /**
   * The external URL that points to Concourse. Defaults to the env variable
   * "ATC_EXTERNAL_URL".
   */
  concourse_url?: Type.BuildMetadata | string
  /**
   * Concourse local user (or basic auth) username. Required for non-public
   * pipelines if using alert type "fixed" or "broke"
   */
  username?: Utils.Secret | string
  /**
   * Concourse local user (or basic auth) password. Required for non-public
   * pipelines if using alert type "fixed" or "broke"
   */
  password?: Utils.Secret
  /**
   * Disables the resource (does not send notifications). Defaults to false.
   */
  disable?: boolean
}

export type PutParams = {
  /**
   * The type of alert to send to Slack. See Alert Types. Defaults to default.
   *
   * https://github.com/arbourd/concourse-slack-alert-resource#alert-types
   *
   * - "fixed" is a special alert type that only alerts if the previous build did
   *   not succeed. Fixed requires username and password to be set for the
   *   resource if the pipeline is not public.
   * - "broke" is a special alert type that only alerts if the previous build
   *   succeeded. Broke requires username and password to be set for the
   *   resource if the pipeline is not public.
   */
  alert_type?:
    | 'default'
    | 'success'
    | 'failed'
    | 'started'
    | 'aborted'
    | 'errored'
    | 'fixed'
    | 'broke'
  /**
   * Channel where this message is posted. Defaults to the channel setting in
   * Source.
   */
  channel?: string
  /**
   * File containing text which overrides channel. If the file cannot be read,
   * channel will be used instead.
   */
  channel_file?: string
  /**
   * The status message at the top of the alert. Defaults to name of alert type.
   */
  message?: string
  /**
   * File containing text which overrides message. If the file cannot be read,
   * message will be used instead.
   */
  message_file?: string
  /**
   * Additional text below the message of the alert. Defaults to an empty
   * string.
   */
  text?: string
  /**
   * File containing text which overrides text. If the file cannot be read, text
   * will be used instead.
   */
  text_file?: string
  /**
   * The color of the notification bar as a hexadecimal. Defaults to the icon
   * color of the alert type.
   */
  color?: string
  /**
   * Disables the alert. Defaults to false.
   */
  disable?: boolean
}

export type GetParams = never

export class SlackAlertResource extends Resource<Source, PutParams, GetParams> {
  constructor(
    public override name: string,
    type: SlackAlertResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
