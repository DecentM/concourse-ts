import {VError} from 'verror'
import {Initer} from '~/declarations/initialisable'

import * as Type from '~/declarations/types'

import {Resource} from '../resource'

import {Step} from './_base'

export class PutStep<
  ParamType extends Type.Config = never
> extends Step<Type.PutStep> {
  constructor(public name: string, init?: Initer<PutStep<ParamType>>) {
    super(name)

    if (init) {
      init(this)
    }
  }

  private put?: Type.Identifier

  public set_put = <ResourceType extends Resource<any, ParamType, any>>(
    resource: ResourceType
  ) => {
    this.put = resource.name
  }

  private resource?: Type.Identifier

  public set_resource = <ResourceType extends Resource>(
    resource: ResourceType
  ) => {
    this.resource = resource.name
  }

  private inputs: Type.Inputs = 'detect'

  public set_inputs = (inputs: Type.Inputs) => {
    this.inputs = inputs
  }

  private params: ParamType

  public set_params = (params: ParamType) => {
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
    if (!this.put) {
      throw new VError(
        'Cannot serialise PutStep because "put" has not been set'
      )
    }

    const result: Type.PutStep = {
      ...this.serialise_base(),
      put: this.put,
      resource: this.resource,
      params: this.params,
      inputs: this.inputs,
      get_params: this.get_params,
    }

    return result
  }
}
