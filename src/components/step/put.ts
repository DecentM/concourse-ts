import {VError} from 'verror'
import {Initer} from '~/declarations/initialisable'

import * as Type from '~/declarations/types'

import {Resource} from '../resource'

import {Step} from './_base'

export class PutStep extends Step<Type.PutStep> {
  constructor(public name: string, init?: Initer<PutStep>) {
    super(name)

    if (init) {
      init(this)
    }
  }

  private put?: Type.Identifier

  public set_put = (resource: Resource) => {
    this.put = resource.name
  }

  private resource?: Type.Identifier

  public set_resource = (resource: Resource) => {
    this.resource = resource.name
  }

  private inputs: Type.Inputs = 'detect'

  public set_inputs = (inputs: Type.Inputs) => {
    this.inputs = inputs
  }

  private params: Type.Config

  public set_param = (...params: Type.Param[]) => {
    if (!this.params) this.params = {}

    params.forEach((param) => {
      this.params[param.key] = param.value
    })
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
