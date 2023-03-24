import * as ConcourseTs from '@decentm/concourse-ts'
import * as RegistryImage from '@decentm/concourse-ts-resource-registry-image'

/**
 * https://github.com/DecentM/concourse-curl-resource
 */
export type Source = {
  /**
   * The address this resource will interact with. Any URL accepted by `curl` is
   * allowed.
   */
  url: string
  /**
   * An array of strings to pass to `curl`. For the best results, wrap each in
   * double quotes. Example:
   * ```yaml
   * arguments:
   *   - "-A"
   *   - "My-User-Agent"
   * ```
   */
  arguments?: ConcourseTs.Type.YamlValue[]
  /**
   * Same as `arguments`, but this will only be passed during the `check`
   * behaviour.
   */
  check_arguments?: string[]
  /**
   * An object that defines a range of response codes. If the response code of
   * the URL is within this range, the request will be considered successful.
   */
  response_code?: {
    /**
     * Default: 200.
     *
     * The lower bound of the acceptable range
     */
    min?: number
    /**
     * Default: 299.
     *
     * The upper bound of the acceptable range
     */
    max?: number
  }
}

export type PutParams = {
  /**
   * The address this resource will interact with. Any URL accepted by `curl` is
   * allowed, and if not specified the URL from the source configuration will be
   * used.
   */
  url?: string

  /**
   * An additional array of strings that serve as arguments. This array will be
   * merged with the arguments from the source configuration, `check_arguments`
   * is ignored.
   */
  arguments?: ConcourseTs.Type.YamlValue[]
}

export type GetParams = {
  /**
   * The address this resource will interact with. Any URL accepted by `curl` is
   * allowed, and if not specified the URL from the source configuration will be
   * used.
   */
  url?: string

  /**
   * An additional array of strings that serve as arguments. This array will be
   * merged with the arguments from the source configuration, `check_arguments`
   * is ignored.
   */
  arguments?: ConcourseTs.Type.YamlValue[]
}

export type Resource = ConcourseTs.Resource<Source, PutParams, GetParams>

export type ResourceType = ConcourseTs.ResourceType<
  'registry-image',
  RegistryImage.Source<'decentm/concourse-curl-resource'>
>
