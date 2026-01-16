import VError from 'verror'

import { Customiser } from '../declarations/customiser.js'
import * as Type from '../declarations/types.js'

import { Duration, DurationInput, get_duration } from '../utils/duration/index.js'

import { ResourceType } from './resource-type.js'
import { GetStep, PutStep } from './step/index.js'
import { Job } from './job.js'
import { type_of } from '../utils/index.js'
import { get_identifier } from '../utils/identifier/index.js'

type AsPutStepInput<PutParams> = {
  params?: PutParams
  inputs?: Type.Inputs
}

type AsGetStepInput<GetParams> = {
  params?: GetParams
  passed?: Job[]
  trigger?: boolean
}

/**
 * A resource is an external entity that can be checked, fetched (get), and
 * pushed (put). Resources are versioned and can trigger jobs when new versions
 * are detected.
 *
 * https://concourse-ci.org/docs/resources/
 */
export class Resource<
  Source extends Type.Config = Type.Config,
  PutParams extends Type.Config = Type.Config,
  GetParams extends Type.Config = Type.Config,
  ResourceTypeType extends string = string,
  ResourceTypeConfig extends Type.Config = Type.Config,
> {
  private static customiser: Customiser<Resource>

  /**
   * Customises all Resources constructed after calling this function.
   *
   * {@link Type.Customiser}
   *
   * @param {Customiser<Resource>} init
   */
  public static customise = (init: Customiser<Resource>) => {
    Resource.customiser = init
  }

  private static get_step_customiser: Customiser<GetStep, Resource>

  /**
   * Customises all GetSteps created from any Resource's as_get_step method.
   *
   * {@link Type.Customiser}
   *
   * @param init Customiser function receiving the GetStep and the Resource it was created from
   */
  public static customise_get_step = <
    Source extends Type.Config = Type.Config,
    PutParams extends Type.Config = Type.Config,
    GetParams extends Type.Config = Type.Config,
  >(
    init: Customiser<
      GetStep<Source, PutParams, GetParams>,
      Resource<Source, PutParams, GetParams>
    >
  ) => {
    Resource.get_step_customiser = init
  }

  private static put_step_customiser: Customiser<PutStep, Resource>

  /**
   * Customises all PutSteps created from any Resource's as_put_step method.
   *
   * {@link Type.Customiser}
   *
   * @param init Customiser function receiving the PutStep and the Resource it was created from
   */
  public static customise_put_step = <
    Source extends Type.Config = Type.Config,
    PutParams extends Type.Config = Type.Config,
    GetParams extends Type.Config = Type.Config,
  >(
    init: Customiser<
      PutStep<Source, PutParams, GetParams>,
      Resource<Source, PutParams, GetParams>
    >
  ) => {
    Resource.put_step_customiser = init
  }

  private get_step_customiser: Customiser<GetStep, Resource>

  /**
   * Customises GetSteps created from this specific Resource instance's
   * as_get_step method.
   *
   * {@link Type.Customiser}
   *
   * @param init Customiser function receiving the GetStep and this Resource
   */
  public customise_get_step = (
    init: Customiser<
      GetStep<Source, PutParams, GetParams>,
      Resource<Source, PutParams, GetParams>
    >
  ) => {
    this.get_step_customiser = init
  }

  private put_step_customiser: Customiser<PutStep, Resource>

  /**
   * Customises PutSteps created from this specific Resource instance's
   * as_put_step method.
   *
   * {@link Type.Customiser}
   *
   * @param init Customiser function receiving the PutStep and this Resource
   */
  public customise_put_step = (
    init: Customiser<
      PutStep<Source, PutParams, GetParams>,
      Resource<Source, PutParams, GetParams>
    >
  ) => {
    this.put_step_customiser = init
  }

  private name: string

  /**
   * Sets the name of the resource. The name is used to reference the resource
   * in jobs and steps.
   *
   * https://concourse-ci.org/docs/resources/#resource-schema
   *
   * @param {string} name The resource name
   */
  public set_name = (name: string) => {
    this.name = name
  }

  constructor(
    name: string,
    private type: ResourceType<ResourceTypeType, ResourceTypeConfig>,
    customise?: Customiser<Resource<Source, PutParams, GetParams>>
  ) {
    this.name = name

    if (Resource.customiser) {
      Resource.customiser(this)
    }

    if (customise) {
      customise(this)
    }
  }

  /**
   * @internal Used by the compiler
   */
  public get_resource_types = (): ResourceType[] => {
    const result: ResourceType[] = []

    result.push(this.type)

    let subtype: ResourceType = this.type.get_type()

    while (subtype instanceof ResourceType) {
      result.push(subtype)
      subtype = subtype.get_type()
    }

    return result
  }

  private source?: Source

  /**
   * https://concourse-ci.org/docs/resources/#resource-schema
   */
  public set_source = (source: Source) => {
    this.source = source
  }

  private check_every?: Duration

  /**
   * Sets how frequently to check for new versions of the resource.
   * Use 'never' to disable automatic checking.
   *
   * https://concourse-ci.org/docs/resources/#resource-schema
   *
   * @param {DurationInput | 'never'} input Duration between checks
   */
  public set_check_every = (input: DurationInput | 'never') => {
    this.check_every = get_duration(input)
  }

  private icon?: string

  /**
   * Sets the Material Design icon to display for this resource in the UI.
   * See https://pictogrammers.com/library/mdi/ for available icons.
   *
   * https://concourse-ci.org/docs/resources/#resource-schema
   *
   * @param {string} icon The icon name (e.g., 'git', 'docker')
   */
  public set_icon = (icon: string) => {
    this.icon = icon
  }

  private old_name?: string

  /**
   * https://concourse-ci.org/docs/resources/#resource-schema
   */
  public set_old_name = (old_name: string) => {
    this.old_name = old_name
  }

  private public?: boolean

  /**
   * Sets "public" to true - avoid calling to keep false
   *
   * https://concourse-ci.org/docs/resources/#resource-schema
   */
  public set_public = () => {
    this.public = true
  }

  private tags?: Type.Tags

  /**
   * Adds tags to specify which workers should run the resource's check,
   * get, and put operations.
   *
   * https://concourse-ci.org/docs/resources/#resource-schema
   *
   * @param {...string[]} tags Worker tags
   */
  public add_tags = (...tags: string[]) => {
    if (!this.tags) this.tags = []

    this.tags.push(...tags)
  }

  private version?: Type.Version

  /**
   * Pins the resource to a specific version. When set, only this version
   * will be used unless explicitly unpinned.
   *
   * https://concourse-ci.org/docs/resources/#resource-schema
   *
   * @param {Type.Version} version The version to pin to
   */
  public set_version = (version: Type.Version) => {
    this.version = version
  }

  private webhook_token?: string

  /**
   * Sets a token for webhook-triggered checking. When set, external systems
   * can notify Concourse of new versions via webhook.
   *
   * https://concourse-ci.org/docs/resources/#resource-schema
   *
   * @param {string} webhook_token The webhook token
   */
  public set_webhook_token = (webhook_token: string) => {
    this.webhook_token = webhook_token
  }

  /**
   * Creates a PutStep for pushing to this resource. The step can be added
   * to a job's plan.
   *
   * https://concourse-ci.org/docs/steps/put/
   *
   * @param {AsPutStepInput<PutParams>} input Optional params and inputs for the put
   * @param {Customiser<PutStep>} customise Optional customiser for the created step
   * @returns {PutStep} A configured PutStep for this resource
   */
  public as_put_step = (
    input?: AsPutStepInput<PutParams>,
    customise?: Customiser<PutStep<Source, PutParams, GetParams>>
  ) => {
    return new PutStep<Source, PutParams, GetParams>(`${this.name}_put`, (step) => {
      if (Resource.put_step_customiser) {
        Resource.put_step_customiser(step, this)
      }

      if (this.put_step_customiser) {
        this.put_step_customiser(step, this)
      }

      step.set_put(this)

      if (input?.params) {
        step.set_params(input.params)
      }

      if (input?.inputs) {
        step.set_inputs(input.inputs)
      }

      if (customise) {
        customise(step)
      }
    })
  }

  /**
   * Creates a GetStep for fetching this resource. The step can be added
   * to a job's plan.
   *
   * https://concourse-ci.org/docs/steps/get/
   *
   * @param {AsGetStepInput<GetParams>} input Optional params, passed jobs, and trigger flag
   * @param {Customiser<GetStep>} customise Optional customiser for the created step
   * @returns {GetStep} A configured GetStep for this resource
   */
  public as_get_step = (
    input?: AsGetStepInput<GetParams>,
    customise?: Customiser<GetStep<Source, PutParams, GetParams>>
  ) => {
    return new GetStep<Source, PutParams, GetParams>(`${this.name}_get`, (step) => {
      if (Resource.get_step_customiser) {
        Resource.get_step_customiser(step, this)
      }

      if (this.get_step_customiser) {
        this.get_step_customiser(step, this)
      }

      step.set_get(this)

      if (input?.params) {
        step.set_params(input.params)
      }

      if (input?.passed) {
        step.add_passed(...input.passed)
      }

      if (type_of(input?.trigger) === 'boolean' && input.trigger) {
        step.set_trigger()
      }

      if (customise) {
        customise(step)
      }
    })
  }

  /**
   * @internal Used by the compiler
   *
   * @returns {Type.Resource} The serialised resource configuration
   */
  public serialise() {
    if (!this.type) {
      throw new VError('Cannot serialise resource without a resource type', {
        resource: this.name,
      })
    }

    const result: Type.Resource = {
      name: get_identifier(this.name),
      type: get_identifier(this.type.name),
      source: this.source,
      check_every: this.check_every,
      icon: this.icon,
      old_name: get_identifier(this.old_name),
      public: this.public,
      tags: this.tags,
      version: this.version,
      webhook_token: this.webhook_token,
    }

    return result
  }
}
