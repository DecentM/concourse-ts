import {VError} from 'verror'

import {Initer} from '../../declarations/initialisable'
import * as Type from '../../declarations/types'

import {Job} from '../job'
import {Resource} from '../resource'

import {Step} from './_base'

export class GetStep<
  ParamType extends Type.Config = never
> extends Step<Type.GetStep> {
  constructor(public override name: string, init?: Initer<GetStep<ParamType>>) {
    super(name)

    if (init) {
      init(this)
    }
  }

  public set_get = <
    ResourceType extends Resource<Type.Config, Type.Config, ParamType>
  >(
    resource: ResourceType
  ) => {
    this.resource = resource
  }

  private resource?: Resource

  public get_resource = () => {
    return this.resource
  }

  private passed: Type.Identifier[]

  public add_passed = (...jobs: Job[]) => {
    if (!this.passed) this.passed = []

    this.passed.push(...jobs.map((job) => job.name))
  }

  private params: ParamType

  public set_params = (params: ParamType) => {
    this.params = params
  }

  public trigger = true

  public version: Type.Version = 'latest'

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
}
