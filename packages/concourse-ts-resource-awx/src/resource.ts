import { Resource, Utils } from '@decentm/concourse-ts'
import { AwxResourceType } from './resource-type'

export type Source = {
  awx: {
    /**
     * The API endpoint of the AWX instance. Follows the same pattern as the AWX
     * API or CLI, e.g., https://your.tower.tld. Note the lack of the trailing
     * lash, and, don't provide /api/v2.
     */
    endpoint: string
    /**
     * The authentication context, both Bearer <oauth_token> and Basic
     * <base64_user_colon_pass> should work.
     */
    auth: Utils.Secret
  }
}

export type PutParams = {
  awx: {
    /**
     * Currently supports either job_templates and workflow_job_templates. The
     * name is plural, but, the behavior is singular (keeping parity with the
     * API terminology).
     */
    type: 'job_templates' | 'workflow_job_templates'
    /**
     * The ID of the job template or workflow job template to launch.
     */
    id: string
    /**
     * (Default: false) Controls whether or not to enable additional
     * debugging information.
     */
    debug?: boolean
  }
}

export type GetParams = never

export class AwxResource extends Resource<Source, PutParams, GetParams> {
  constructor(public override name: string, type: AwxResourceType, source: Source) {
    super(name, type)

    this.source = source
  }
}
