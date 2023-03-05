import {VError} from 'verror'

import {Customiser} from '../../declarations/customiser'
import * as Type from '../../declarations/types'

import {Job} from '../job'
import {Resource} from '../resource'

import {Step} from './_base'

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

  private resource?: Resource

  public get_resources = () => {
    const result = this.get_base_resources()

    if (!this.resource) {
      return result
    }

    result.push(this.resource)

    return result
  }

  private passed: Type.Identifier[]

  public add_passed = (...jobs: Job[]) => {
    if (!this.passed) this.passed = []

    this.passed.push(...jobs.map((job) => job.name))
  }

  private params: GetParams

  public set_params = (params: GetParams) => {
    this.params = params
  }

  public trigger = true

  public version: Type.Version

  public serialise() {
    if (!this.resource) {
      throw new VError(
        'Cannot serialise GetStep because "get" has not been set'
      )
    }

    const result: Type.GetStep = {
      ...this.serialise_base(),
      get: this.resource.name,

      // This will rename the resource, but it's the same as "get" above.
      resource: undefined,
      passed: this.passed,
      params: this.params,
      trigger: this.trigger,
      version: this.version,
    }

    return result
  }

  public static deserialise(
    name: string,
    resourcePool: Resource[],
    input: Type.GetStep
  ) {
    return new GetStep(name, (step) => {
      this.deserialise_base(step, resourcePool, input)

      step.resource = resourcePool.find((resource) => resource.name === name)

      step.passed = input.passed
      step.params = input.params
      step.trigger = input.trigger
      step.version = input.version
    })
  }
}
