import { Customiser } from '../../declarations/customiser.js'
import * as Type from '../../declarations/types.js'
import { get_identifier, Identifier, is_identifier } from '../../utils/index.js'

import { Job } from '../job.js'
import { Resource } from '../resource.js'

import { Step } from './base.js'

/**
 * Fetches a version of a resource. The fetched bits are placed in a directory
 * with the same name as the resource.
 *
 * https://concourse-ci.org/docs/steps/get/
 */
export class GetStep<
  Source extends Type.Config = Type.Config,
  PutParams extends Type.Config = Type.Config,
  GetParams extends Type.Config = Type.Config,
> extends Step<Type.GetStep> {
  private static customiser: Customiser<GetStep>

  /**
   * Customises all GetSteps constructed after calling this function.
   *
   * {@link Type.Customiser}
   *
   * @param {Customiser<GetStep>} init
   */
  public static customise = (init: Customiser<GetStep>) => {
    GetStep.customiser = init
  }

  constructor(
    public override name: string,
    customise?: Customiser<GetStep<Source, PutParams, GetParams>>
  ) {
    super(name)

    if (GetStep.customiser) {
      GetStep.customiser(this)
    }

    if (customise) {
      customise(this)
    }
  }

  /**
   * Sets the resource to fetch.
   *
   * https://concourse-ci.org/docs/steps/get/#get-step
   *
   * @param {Resource} resource The resource to fetch
   */
  public set_get = <ResourceType extends Resource<Source, PutParams, GetParams>>(
    resource: ResourceType
  ) => {
    this.resource = resource
  }

  /**
   * @internal Used by the compiler
   */
  public get_task_steps = () => {
    return this.get_base_task_steps()
  }

  private resource?: Resource

  /**
   * @internal Used by the compiler
   */
  public get_resources = () => {
    const result = this.get_base_resources()

    if (!this.resource) {
      return result
    }

    result.push(this.resource)

    return result
  }

  private passed: Array<Job | string>

  /**
   * Constrains this get step to only fetch versions that have passed through
   * the given jobs. When multiple jobs are specified, only versions that have
   * passed through all of them are considered.
   *
   * https://concourse-ci.org/docs/steps/get/#get-step
   *
   * @param {...Array<Job | string>} jobs Jobs that must have passed
   */
  public add_passed = (...jobs: Array<Job | string>) => {
    if (!this.passed) this.passed = []

    this.passed.push(...jobs)
  }

  private params: GetParams

  /**
   * Arbitrary configuration to pass to the resource when fetching. Refer to
   * the resource type's documentation to see what parameters it supports.
   *
   * https://concourse-ci.org/docs/steps/get/#get-step
   *
   * @param {GetParams} params Resource-specific parameters
   */
  public set_params = (params: GetParams) => {
    this.params = params
  }

  private trigger: boolean

  /**
   * Sets "trigger" to true - avoid calling to keep false
   *
   * https://concourse-ci.org/docs/steps/get/#get-step
   */
  public set_trigger = () => {
    this.trigger = true
  }

  private version: Type.Version

  /**
   * Sets a specific version of the resource to fetch. If not specified,
   * the latest version will be fetched.
   *
   * https://concourse-ci.org/docs/steps/get/#get-step
   *
   * @param {Type.Version} version The version to fetch
   */
  public set_version = (version: Type.Version) => {
    this.version = version
  }

  /**
   * Serialises this step into a valid Concourse configuration fixture.
   * The returned value needs to be converted into YAML to be used in Concourse.
   *
   * @returns {Type.GetStep}
   */
  public serialise(): Type.GetStep {
    const resource = this.resource?.serialise()

    return {
      ...this.serialise_base(),
      get: get_identifier(resource?.name),

      // This will rename the resource, but it's the same as "get" above.
      resource: undefined,
      passed: this.passed
        ? (this.passed
            .map((passed_job) => {
              if (is_identifier(passed_job)) return passed_job
              if (passed_job instanceof Job) return passed_job.name

              return null
            })
            .filter((i) => !!i) as Identifier[])
        : undefined,
      params: this.params,
      trigger: this.trigger,
      version: this.version,
    }
  }
}
