import {Customiser} from '../../declarations/customiser'
import {Identifier} from '../../utils/identifier'
import * as Type from '../../declarations/types'

import {Job} from '../job'
import {Resource} from '../resource'

import {Step} from './base'

export class GetStep<
  Source extends Type.Config = Type.Config,
  PutParams extends Type.Config = Type.Config,
  GetParams extends Type.Config = Type.Config
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

  public set_get = <
    ResourceType extends Resource<Source, PutParams, GetParams>
  >(
    resource: ResourceType
  ) => {
    this.resource = resource
  }

  /**
   * @internal Used by the compiler
   *
   * @returns {TaskStep[]}
   */
  public get_task_steps() {
    return this.get_base_task_steps()
  }

  private resource?: Resource

  public get_resources = () => {
    const result = this.get_base_resources()

    if (!this.resource) {
      return result
    }

    result.push(this.resource)

    return result
  }

  private passed: Identifier[] = []

  public add_passed = (...jobs: Job[]) => {
    this.passed.push(...jobs.map((job) => job.name))
  }

  private params: GetParams

  public set_params = (params: GetParams) => {
    this.params = params
  }

  public trigger: boolean

  public version: Type.Version

  public serialise() {
    const result: Type.GetStep = {
      ...this.serialise_base(),
      get: this.resource?.name,

      // This will rename the resource, but it's the same as "get" above.
      resource: undefined,
      passed: this.passed,
      params: this.params,
      trigger: this.trigger,
      version: this.version,
    }

    return result
  }
}
