import {VError} from 'verror'
import {Initer} from '~/declarations/initialisable'

import * as Type from '~/declarations/types'

import {Resource} from '../resource'

import {Step} from './_base'

export class PutStep extends Step<Type.PutStep> {
  constructor(init?: Initer<PutStep>) {
    super()

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

  public set_param = (key: string, value: Type.YamlValue) => {
    if (!this.params) this.params = {}

    this.params[key] = value
  }

  private get_params: Type.Config

  public set_get_param = (key: string, value: Type.YamlValue) => {
    if (!this.get_params) this.get_params = {}

    this.get_params[key] = value
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
