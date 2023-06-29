import {VError} from 'verror'

import {Customiser} from '../declarations/customiser'
import * as Type from '../declarations/types'

import {Duration, DurationInput, get_duration} from '../utils/duration'

import {ResourceType} from './resource-type'
import {GetStep, PutStep} from './step'
import {Job} from './job'
import {type_of} from '../utils'
import {get_identifier} from '../utils/identifier'

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
    Source extends Type.Config = Type.Config,
    PutParams extends Type.Config = Type.Config,
    GetParams extends Type.Config = Type.Config
  >(
    init: Customiser<
      GetStep<Source, PutParams, GetParams>,
      Resource<Source, PutParams, GetParams>
    >
  ) => {
    Resource.get_step_customiser = init
  }

  private static put_step_customiser: Customiser<PutStep, Resource>

  public static customise_put_step = <
    Source extends Type.Config = Type.Config,
    PutParams extends Type.Config = Type.Config,
    GetParams extends Type.Config = Type.Config
  >(
    init: Customiser<
      PutStep<Source, PutParams, GetParams>,
      Resource<Source, PutParams, GetParams>
    >
  ) => {
    Resource.put_step_customiser = init
  }

  private get_step_customiser: Customiser<GetStep, Resource>

  public customise_get_step = (
    init: Customiser<
      GetStep<Source, PutParams, GetParams>,
      Resource<Source, PutParams, GetParams>
    >
  ) => {
    this.get_step_customiser = init
  }

  private put_step_customiser: Customiser<PutStep, Resource>

  public customise_put_step = (
    init: Customiser<
      PutStep<Source, PutParams, GetParams>,
      Resource<Source, PutParams, GetParams>
    >
  ) => {
    this.put_step_customiser = init
  }

  public name: string

  constructor(
    name: string,
    private type: ResourceType,
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

  public source?: Source

  private check_every?: Duration

  public set_check_every = (input: DurationInput | 'never') => {
    this.check_every = get_duration(input)
  }

  /**
   * https://materialdesignicons.com/
   */
  public icon?: string

  public old_name?: string

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
