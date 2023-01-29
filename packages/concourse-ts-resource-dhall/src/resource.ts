import { Resource } from '@decentm/concourse-ts'
import { DhallResourceType } from './resource-type'

/**
 * https://github.com/coralogix/eng-concourse-resource-dhall
 */
export type Source = {
  /**
   * A Dhall expression that is fed directly to the dhall executable,
   * e.g. { foo = "bar" }
   */
  expression: string
  /**
   * Wheter to pass the --ascii flag to the dhall executable. Defaults to false.
   */
  ascii?: boolean
  /**
   * Whether to pass the --censor flag to the dhall executable. Defaults to
   * false.
   */
  censor?: boolean
  /**
   * Whether to pass the --explain flag to the dhall executable. Defaults to
   * false.
   */
  explain?: boolean
  /**
   * Adds the included environment variables when running the dhall executable.
   * See example usage below.
   */
  environment_variables?: Record<string, string>
}

export type PutParams = never

export type GetParams = Record<string, never>

export class DhallResource extends Resource<Source, PutParams, GetParams> {
  constructor(
    public override name: string,
    type: DhallResourceType,
    source: Source
  ) {
    super(name, type)

    this.source = source
  }
}
