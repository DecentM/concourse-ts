import * as ConcourseTs from '@decentm/concourse-ts'
import VError from 'verror'

import { StepBuilderBase } from './base.js'
import { ResourceBuilder } from '../resource.js'

export class GetStepBuilder extends StepBuilderBase<ConcourseTs.GetStep> {
  public override build(): ConcourseTs.GetStep {
    if (!this._name) {
      throw new VError('Cannot build get step without a name')
    }

    const step = new ConcourseTs.GetStep(this._name)

    if (this._customise_or_resource instanceof ConcourseTs.Resource) {
      step.set_get(this._customise_or_resource)
    } else if (this._customise_or_resource) {
      const resource_builder = new ResourceBuilder()
      this._customise_or_resource(resource_builder)

      step.set_get(resource_builder.build())
    }

    if (this._params) step.set_params(this._params)
    if (this._version) step.version = this._version
    if (typeof this._trigger === 'boolean') step.trigger = this._trigger

    return step
  }

  private _customise_or_resource:
    | ConcourseTs.Resource
    | ConcourseTs.Type.Customiser<ResourceBuilder>

  public get(
    customise_or_resource:
      | ConcourseTs.Resource
      | ConcourseTs.Type.Customiser<ResourceBuilder>
  ): GetStepBuilder {
    if (this._customise_or_resource) {
      throw new VError(
        `Cannot overwrite resource or resource customiser on "${this._name}"`
      )
    }

    this._customise_or_resource = customise_or_resource

    return this
  }

  private _params: ConcourseTs.Type.Config

  public params<GetParams extends ConcourseTs.Type.Config>(
    params: GetParams
  ): GetStepBuilder {
    this._params = params

    return this
  }

  private _version: ConcourseTs.Type.Version

  public version(version: ConcourseTs.Type.Version): GetStepBuilder {
    this._version = version

    return this
  }

  private _trigger: boolean

  public trigger(): GetStepBuilder {
    this._trigger = true

    return this
  }
}
