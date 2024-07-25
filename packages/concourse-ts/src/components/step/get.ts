import { Customiser } from '../../declarations/customiser.js'
import * as Type from '../../declarations/types.js'
import { get_identifier } from '../../utils/index.js'

import { Job } from '../job.js'
import { Resource } from '../resource.js'

import { Step } from './base.js'

export class GetStep<
  Source extends Type.Config = Type.Config,
  PutParams extends Type.Config = Type.Config,
  GetParams extends Type.Config = Type.Config,
> extends Step<Type.GetStep> {
  private static customiser: Customiser<GetStep>

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

  public set_get = <ResourceType extends Resource<Source, PutParams, GetParams>>(
    resource: ResourceType
  ) => {
    this.resource = resource
  }

  /**
   * @internal Used by the compiler
   */
  public get_task_steps() {
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

  private passed: Job[]

  public add_passed = (...jobs: Job[]) => {
    if (!this.passed) this.passed = []

    this.passed.push(...jobs)
  }

  private params: GetParams

  public set_params = (params: GetParams) => {
    this.params = params
  }

  public trigger: boolean

  public version: Type.Version

  public serialise(): Type.GetStep {
    return {
      ...this.serialise_base(),
      get: get_identifier(this.resource?.name),

      // This will rename the resource, but it's the same as "get" above.
      resource: undefined,
      passed: this.passed
        ? this.passed.map((passed_job) => get_identifier(passed_job.name))
        : undefined,
      params: this.params,
      trigger: this.trigger,
      version: this.version,
    }
  }
}
