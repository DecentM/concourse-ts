import {Customiser} from '../../declarations/customiser'
import * as Type from '../../declarations/types'

import {Resource} from '../resource'

import {Step} from './base'

export class PutStep<
  Source extends Type.Config = Type.Config,
  PutParams extends Type.Config = Type.Config,
  GetParams extends Type.Config = Type.Config
> extends Step<Type.PutStep> {
  private static customiser: Customiser<PutStep>

  public static customise = (init: Customiser<PutStep>) => {
    PutStep.customiser = init
  }

  constructor(
    public override name: string,
    customise?: Customiser<PutStep<Source, PutParams, GetParams>>
  ) {
    super(name)

    if (PutStep.customiser) {
      PutStep.customiser(this)
    }

    if (customise) {
      customise(this)
    }
  }

  public set_put = <
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

  private resource?: Resource<Source, PutParams, GetParams>

  public get_resources = (): Resource[] => {
    const result = this.get_base_resources()

    if (!this.resource) {
      return result
    }

    result.push(this.resource)

    return result
  }

  private inputs: Type.Inputs

  public set_inputs = (inputs: Type.Inputs) => {
    this.inputs = inputs
  }

  private params: PutParams

  public set_params = (params: PutParams) => {
    this.params = params
  }

  private get_params: Type.Config

  public set_get_param = (...params: Type.Param[]) => {
    if (!this.get_params) this.get_params = {}

    params.forEach((param) => {
      this.get_params[param.key] = param.value
    })
  }

  public serialise() {
    const result: Type.PutStep = {
      ...this.serialise_base(),
      put: this.resource?.name,

      // This will rename the resource, but it's the same as "put" above.
      resource: undefined,
      params: this.params,
      inputs: this.inputs,
      get_params: this.get_params,
    }

    return result
  }
}
