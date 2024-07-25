import * as ConcourseTs from '@decentm/concourse-ts'

import { StepBuilderBase } from './base.js'
import { ResourceBuilder } from '../resource.js'

export class PutStepBuilder extends StepBuilderBase<ConcourseTs.PutStep> {
  public override build(): ConcourseTs.PutStep<
    ConcourseTs.Type.Config,
    ConcourseTs.Type.Config,
    ConcourseTs.Type.Config
  > {
    const step = new ConcourseTs.PutStep(this._name)

    if (this._customise_or_resource instanceof ConcourseTs.Resource) {
      step.set_put(this._customise_or_resource)
    } else if (this._customise_or_resource) {
      const resource_builder = new ResourceBuilder()
      this._customise_or_resource(resource_builder)

      step.set_put(resource_builder.build())
    }

    if (this._inputs) step.set_inputs(this._inputs)
    if (this._params) step.set_params(this._params)
    if (this._get_params) step.set_get_params(this._get_params)
    if (this._no_get) step.no_get = this._no_get

    return step
  }

  private _customise_or_resource:
    | ConcourseTs.Resource
    | ConcourseTs.Type.Customiser<ResourceBuilder>

  public put<
    Source extends ConcourseTs.Type.Config = ConcourseTs.Type.Config,
    PutParams extends ConcourseTs.Type.Config = ConcourseTs.Type.Config,
    GetParams extends ConcourseTs.Type.Config = ConcourseTs.Type.Config,
  >(
    customise_or_resource:
      | ConcourseTs.Resource<Source, PutParams, GetParams>
      | ConcourseTs.Type.Customiser<ResourceBuilder<Source, PutParams, GetParams>>
  ): PutStepBuilder {
    this._customise_or_resource = customise_or_resource

    return this
  }

  private _inputs: ConcourseTs.Type.Inputs

  public inputs(inputs: ConcourseTs.Type.Inputs): PutStepBuilder {
    this._inputs = inputs

    return this
  }

  private _params: ConcourseTs.Type.Config

  public params<PutParams extends ConcourseTs.Type.Config>(
    params: PutParams
  ): PutStepBuilder {
    this._params = params

    return this
  }

  private _get_params: ConcourseTs.Type.Config

  public get_params<GetParams extends ConcourseTs.Type.Config>(
    params: GetParams
  ): PutStepBuilder {
    this._get_params = params

    return this
  }

  private _no_get: boolean

  public no_get(): PutStepBuilder {
    this._no_get = true

    return this
  }
}
