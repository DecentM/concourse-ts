import {VError} from 'verror'

import {Customiser} from '../declarations/customiser'
import * as Type from '../declarations/types'

import {Duration, DurationInput, get_duration} from '../utils/duration'

import {ResourceType} from './resource-type'
import {AnyStep, DoStep, GetStep, PutStep} from './step'
import {Job} from './job'
import {type_of} from '../utils'
import {get_identifier, Identifier} from '../utils/identifier'

type AsPutStepInput<PutParams> = {
  params?: PutParams
  inputs?: Type.Inputs
}

type AsGetStepInput<GetParams> = {
  params?: GetParams
  passed?: Job[]
  trigger?: boolean
}

export class Resource<
  Source extends Type.Config = Type.Config,
  PutParams extends Type.Config = Type.Config,
  GetParams extends Type.Config = Type.Config
> {
  private static customiser: Customiser<Resource>

  public static customise = (init: Customiser<Resource>) => {
    Resource.customiser = init
  }

  private static get_step_customiser: Customiser<GetStep, Resource>

  public static customise_get_step = <
    CustomResource extends Resource,
    GetParams extends Type.Config = Type.Config
  >(
    init: Customiser<GetStep<GetParams>, CustomResource>
  ) => {
    Resource.get_step_customiser = init
  }

  private static put_step_customiser: Customiser<PutStep, Resource>

  public static customise_put_step = <
    CustomResource extends Resource,
    PutParams extends Type.Config = Type.Config
  >(
    init: Customiser<PutStep<PutParams>, CustomResource>
  ) => {
    Resource.put_step_customiser = init
  }

  private get_step_customiser: Customiser<GetStep, Resource>

  public customise_get_step = <
    CustomResource extends Resource,
    GetParams extends Type.Config = Type.Config
  >(
    init: Customiser<GetStep<GetParams>, CustomResource>
  ) => {
    this.get_step_customiser = init
  }

  private put_step_customiser: Customiser<PutStep, Resource>

  public customise_put_step = <
    CustomResource extends Resource,
    PutParams extends Type.Config = Type.Config
  >(
    init: Customiser<PutStep<PutParams>, CustomResource>
  ) => {
    this.put_step_customiser = init
  }

  public name: Identifier

  constructor(
    name: string,
    private type: ResourceType,
    customise?: Customiser<Resource<Source, PutParams, GetParams>>
  ) {
    this.name = get_identifier(name)

    if (Resource.customiser) {
      Resource.customiser(this)
    }

    if (customise) {
      customise(this)
    }
  }

  public get_resource_type = () => this.type

  public source?: Source

  private check_every?: Duration

  public set_check_every = (input: DurationInput | 'never') => {
    this.check_every = get_duration(input)
  }

  /**
   * https://materialdesignicons.com/
   */
  public icon?: string

  public old_name?: Identifier

  public public: boolean

  private tags?: Type.Tags

  public add_tag = (...tags: string[]) => {
    if (!this.tags) this.tags = []

    this.tags.push(...tags)
  }

  private version?: Type.Version

  public set_version = (version: Type.Version) => {
    this.version = version
  }

  public webhook_token?: string

  public as_put_step = (
    input?: AsPutStepInput<PutParams>,
    customise?: Customiser<PutStep<Source, PutParams, GetParams>>
  ) => {
    return new PutStep<Source, PutParams, GetParams>(
      `${this.name}_put`,
      (step) => {
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
      }
    )
  }

  public as_get_step = (
    input?: AsGetStepInput<GetParams>,
    customise?: Customiser<GetStep<Source, PutParams, GetParams>>
  ) => {
    return new GetStep<Source, PutParams, GetParams>(
      `${this.name}_get`,
      (step) => {
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

        if (type_of(input?.trigger) === 'boolean') {
          step.trigger = input.trigger
        }

        if (customise) {
          customise(step)
        }
      }
    )
  }

  serialise() {
    if (!this.type) {
      throw new VError('Cannot serialise resource without a resource type', {
        resource: this.name,
      })
    }

    const result: Type.Resource = {
      name: this.name,
      type: this.type.name,
      source: this.source,
      check_every: this.check_every,
      icon: this.icon,
      old_name: this.old_name,
      public: this.public,
      tags: this.tags,
      version: this.version,
      webhook_token: this.webhook_token,
    }

    return result
  }
}
