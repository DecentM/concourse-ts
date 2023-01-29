import { Resource } from '@decentm/concourse-ts'
import { AppcenterResourceType } from './resource-type'

/**
 * https://github.com/tomoyukim/concourse-appcenter-resource
 */
export type Source = {
  /**
   * Prepare API token to call App Center API and set here. See how to get API token.
   * https://docs.microsoft.com/en-us/appcenter/api-docs/index
   */
  api_token: string
  /**
   * The owner_name used in the URL for the API calls of App Center. See the detail.
   * https://docs.microsoft.com/en-us/appcenter/distribution/uploading#distributing-using-the-apis
   */
  owner: string
  /**
   * Your app_name used in the URL for the API calls of App Center. See the detail.
   * https://docs.microsoft.com/en-us/appcenter/distribution/uploading#distributing-using-the-apis
   */
  app_name: string
  /**
   * Group ID to distribute group.
   */
  group_id: string
  /**
   * Default: false
   */
  mandatory_update?: boolean
  /**
   * Default: false
   */
  notify_testers?: boolean
  /**
   * Target tester's email
   */
  email: string
  store_id: string
}

export type PutParams = {
  /**
   * The target binary file name to release. (default value is app_name)
   */
  binary_name?: string
  /**
   * File name of release notes.
   */
  release_notes?: string
  /**
   * The path to a directory containing target files to release like binary or release_notes.
   */
  path?: string
}

export type GetParams = never

export class AppcenterResource extends Resource<Source, PutParams, GetParams> {
  constructor(
    public override name: string,
    type: AppcenterResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
