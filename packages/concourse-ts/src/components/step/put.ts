import {VError} from 'verror'

import {Initer} from '../../declarations/initialisable'
import * as Type from '../../declarations/types'
import {type_of} from '../../utils'

import {Resource} from '../resource'

import {Step} from './_base'

export class PutStep<
  ParamType extends Type.Config = Type.Config
> extends Step<Type.PutStep> {
  constructor(public override name: string, init?: Initer<PutStep<ParamType>>) {
    super(name)

    if (init) {
      init(this)
    }
  }

  public set_put = <
    ResourceType extends Resource<Type.Config, ParamType, Type.Config>
  >(
    resource: ResourceType
  ) => {
    this.resource = resource
  }

  private resource?: Resource

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
    if (!this.resource) {
      throw new VError(
        'Cannot serialise PutStep because "put" has not been set'
      )
    }

    const result: Type.PutStep = {
      ...this.serialise_base(),
      put: this.resource.name,

      // This will rename the resource, but it's the same as "put" above.
      resource: undefined,
      params: this.params,
      inputs: this.inputs,
      get_params: this.get_params,
    }

    return result
  }

  public static deserialise(
    name: string,
    resourcePool: Resource[],
    input: Type.PutStep
  ) {
    return new PutStep(name, (step) => {
      this.deserialise_base(step, resourcePool, input)

      step.resource = resourcePool.find(
        (resource) => resource.name === input.resource
      )

      step.params = input.params
      step.inputs = input.inputs
      step.get_params = input.get_params
    })
  }

  public write() {
    return `new PutStep(${JSON.stringify(this.name)}, (step) => {
      ${super.write_base('step')}

      ${this.resource ? `step.set_put(${this.resource.write()})` : ''}

      ${
        type_of(this.inputs) !== 'undefined'
          ? `step.set_inputs(${JSON.stringify(this.inputs)})`
          : ''
      }

      ${
        type_of(this.params) !== 'undefined'
          ? `step.set_params(${JSON.stringify(this.params)})`
          : ''
      }

      ${
        type_of(this.get_params) !== 'undefined'
          ? `step.set_get_param(...${JSON.stringify(this.get_params)})`
          : ''
      }
    })`
  }
}
