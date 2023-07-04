import * as ConcourseTs from '@decentm/concourse-ts'
import * as RegistryImage from '@decentm/concourse-ts-resource-registry-image'

/**
 * https://github.com/DecentM/concourse-resource-types
 */
export type Source = {
  /**
   * A user's username who has access to the `main` team or the team the
   * resource wants to reference
   */
  username?: ConcourseTs.Utils.Var | string
  /**
   * A user's password who has access to the `main` team or the team the
   * resource wants to reference
   */
  password?: ConcourseTs.Utils.Var
  /**
   * The team associated with the pipeline this resource is in. Default: `main`
   */
  team?: ConcourseTs.Utils.Var | string
  /**
   * An array of strings to pass to `fly`. For the best
   * reqults, wrap each in double quotes. Do not specify `-t`, as it's always the
   * local Concourse instance. Default: `[]`
   * Example:
   *
   * ```yaml
   * arguments:
   *   - "--verbose"
   *   - "workers"
   * ```
   */
  arguments?: ConcourseTs.Type.YamlValue[]
  /**
   * Same as `arguments`, but this will only be passed during the `check`
   * behaviour.
   */
  check_arguments?: string[]
}

export type PutParams = {
  /**
   * If true, `fly sync` will be ran before the specified command with
   * arguments. Default: `<empty>`
   */
  sync?: boolean

  /**
   * An additional array of strings that serve as arguments. This array will be
   * merged with the arguments from the source configuration, `check_arguments`
   * is ignored.
   */
  arguments?: ConcourseTs.Type.YamlValue[]

  /**
   * If `true`, no request will be made.
   */
  skip?: boolean
}

export type GetParams = {
  /**
   * If true, `fly sync` will be ran before the specified command with
   * arguments. Default: `<empty>`
   */
  sync?: boolean

  /**
   * An additional array of strings that serve as arguments. This array will be
   * merged with the arguments from the source configuration, `check_arguments`
   * is ignored.
   */
  arguments?: ConcourseTs.Type.YamlValue[]

  /**
   * If `true`, no request will be made.
   */
  skip?: boolean
}

export type Resource = ConcourseTs.Resource<Source, PutParams, GetParams>

export type ResourceType = ConcourseTs.ResourceType<
  'registry-image',
  RegistryImage.Source<'decentm/concourse-fly-resource'>
>
