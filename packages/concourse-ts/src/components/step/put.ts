import { Customiser } from '../../declarations/customiser.js'
import * as Type from '../../declarations/types.js'
import { get_identifier } from '../../utils/index.js'

import { Resource } from '../resource.js'

import { Step } from './base.js'

/**
 * Pushes to a resource. When the step succeeds, the resulting version is
 * immediately fetched into a directory with the same name as the resource.
 *
 * https://concourse-ci.org/docs/steps/put/
 */
export class PutStep<
  Source extends Type.Config = Type.Config,
  PutParams extends Type.Config = Type.Config,
  GetParams extends Type.Config = Type.Config,
> extends Step<Type.PutStep> {
  private static customiser: Customiser<PutStep>

  /**
   * Customises all PutSteps constructed after calling this function.
   *
   * {@link Type.Customiser}
   *
   * @param {Customiser<PutStep>} init
   */
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

  /**
   * Sets the resource to push to.
   *
   * https://concourse-ci.org/docs/steps/put/#put-step
   *
   * @param {Resource} resource The resource to push to
   */
  public set_put = <ResourceType extends Resource<Source, PutParams, GetParams>>(
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

  /**
   * @internal Used by the compiler
   */
  public get_resources = (): Resource[] => {
    const result = this.get_base_resources()

    if (!this.resource) {
      return result
    }

    result.push(this.resource)

    return result
  }

  private inputs: Type.Inputs

  /**
   * Specifies which inputs (artifacts) should be available when pushing.
   * Can be 'all', 'detect', or a list of specific input names.
   *
   * https://concourse-ci.org/docs/steps/put/#put-step
   *
   * @param {Type.Inputs} inputs Input specification
   */
  public set_inputs = (inputs: Type.Inputs) => {
    this.inputs = inputs
  }

  private params: PutParams

  /**
   * Sets resource-specific parameters to pass to the resource when pushing.
   * These parameters are defined by the resource type.
   *
   * https://concourse-ci.org/docs/steps/put/#put-step
   *
   * @param {PutParams} params Resource-specific put parameters
   */
  public set_params = (params: PutParams) => {
    this.params = params
  }

  private get_params: Type.Config

  /**
   * Sets parameters to pass when fetching the version that was pushed.
   * By default, the implicit get step uses the same parameters as the original
   * get step that fetched the resource.
   *
   * https://concourse-ci.org/docs/steps/put/#put-step
   *
   * @param {GetParams} params Resource-specific get parameters
   */
  public set_get_params = (params: GetParams) => {
    if (!this.get_params) this.get_params = {}

    this.get_params = {
      ...this.get_params,
      ...params,
    }
  }

  private no_get?: boolean

  /**
   * Sets "no_get" to true - avoid calling to keep false
   *
   * https://concourse-ci.org/docs/steps/put/#put-step
   */
  public set_no_get = () => {
    this.no_get = true
  }

  /**
   * @internal Used by the compiler
   *
   * @returns {Type.PutStep} The serialised put step configuration
   */
  public serialise() {
    const resource = this.resource?.serialise()

    const result: Type.PutStep = {
      ...this.serialise_base(),
      put: get_identifier(resource?.name),

      // This will rename the resource, but it's the same as "put" above.
      resource: undefined,
      params: this.params,
      inputs: this.inputs,
      get_params: this.get_params,
      no_get: this.no_get,
    }

    return result
  }
}
