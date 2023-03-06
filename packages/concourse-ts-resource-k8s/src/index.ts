import * as ConcourseTs from '@decentm/concourse-ts'
import * as RegistryImage from '@decentm/concourse-ts-resource-registry-image'

export type Source = {
  /**
   * URL to Kubernetes Master API service
   */
  cluster_url: string
  /**
   * Base64 encoded PEM. Required if cluster_url is https.
   */
  cluster_ca?: string
  /**
   * Admin user for Kubernetes. admin_user/admin_token or admin_key/admin_cert
   * are required if cluster_url is https.
   */
  admin_user?: string
  /**
   * Admin user token for Kubernetes. admin_user/admin_token or
   * admin_key/admin_cert are required if cluster_url is https.
   */
  admin_token?: string
  /**
   * Base64 encoded PEM. Required if cluster_url is https and no
   * admin_user/admin/token is provided.
   */
  admin_key?: string
  /**
   * Base64 encoded PEM. Required if cluster_url is https and no
   * admin_user/admin/token is provided.
   */
  admin_cert?: string
  /**
   * Kubernetes namespace the objects will be deployed into.
   * Default: default
   */
  namespace?: string
}

/**
 * https://github.com/srinivasa-vasu/concourse-k8s#deploy-configuration-put
 */
export type PutParams = Record<string, ConcourseTs.Type.YamlValue>

export type GetParams = never

export type Resource = ConcourseTs.Resource<Source, PutParams, GetParams>

export type ResourceType = ConcourseTs.ResourceType<
  'registry-image',
  RegistryImage.Source<'srinivasavasu/concourse-k8s'>
>
