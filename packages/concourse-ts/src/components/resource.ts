import {VError} from 'verror'

import {Initer} from '../declarations/initialisable'
import * as Type from '../declarations/types'

import {DurationInput, get_duration, is_duration} from '../utils/duration'

import {ResourceType} from './resource-type'
import {AnyStep, DoStep, GetStep, PutStep} from './step'
import {Job} from './job'
import {type_of} from '../utils'

export type AsPutStepInput<PutParams> = {
  params?: PutParams
  inputs?: Type.Inputs
}

export type AsGetStepInput<GetParams> = {
  params?: GetParams
  passed?: Job[]
  trigger?: boolean
}

export class Resource<
  Source extends Type.Config = Type.Config,
  PutParams extends Type.Config = Type.Config,
  GetParams extends Type.Config = Type.Config
> {
  private static customiser: Initer<Resource>

  public static customise = (init: Initer<Resource>) => {
    Resource.customiser = init
  }

  private static get_step_customiser: Initer<GetStep, Resource>

  public static customise_get_step = <
    CustomResource extends Resource,
    GetParams extends Type.Config = Type.Config
  >(
    init: Initer<GetStep<GetParams>, CustomResource>
  ) => {
    Resource.get_step_customiser = init
  }

  private static put_step_customiser: Initer<PutStep, Resource>

  public static customise_put_step = <
    CustomResource extends Resource,
    PutParams extends Type.Config = Type.Config
  >(
    init: Initer<PutStep<PutParams>, CustomResource>
  ) => {
    Resource.put_step_customiser = init
  }

  constructor(
    public name: string,
    private type: ResourceType,
    init?: Initer<Resource<Source, PutParams, GetParams>>
  ) {
    if (Resource.customiser) {
      Resource.customiser(this)
    }

    if (init) {
      init(this)
    }
  }

  public static from_resource_type(
    name: string,
    input: ResourceType
  ): Resource {
    return new Resource(name, input)
  }

  public get_resource_type = () => this.type

  public source?: Source

  private check_every?: Type.Duration

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
    init?: Initer<PutStep<Source, PutParams, GetParams>>
  ) => {
    return new PutStep<Source, PutParams, GetParams>(
      `${this.name}_put`,
      (step) => {
        if (Resource.put_step_customiser) {
          Resource.put_step_customiser(step, this)
        }

        step.set_put(this)

        if (input?.params) {
          step.set_params(input.params)
        }

        if (input?.inputs) {
          step.set_inputs(input.inputs)
        }

        if (init) {
          init(step)
        }
      }
    )
  }

  public as_get_step = (
    input?: AsGetStepInput<GetParams>,
    init?: Initer<GetStep<Source, PutParams, GetParams>>
  ) => {
    return new GetStep<Source, PutParams, GetParams>(
      `${this.name}_get`,
      (step) => {
        if (Resource.get_step_customiser) {
          Resource.get_step_customiser(step, this)
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

        if (init) {
          init(step)
        }
      }
    )
  }

  public as_abort_handler = (
    stepOrJob: AnyStep | Job,
    input: AsPutStepInput<PutParams>
  ) => {
    stepOrJob.add_on_abort(this.as_put_step(input))
  }

  public as_error_handler = (
    stepOrJob: AnyStep | Job,
    input: AsPutStepInput<PutParams>
  ) => {
    stepOrJob.add_on_error(this.as_put_step(input))
  }

  public as_failure_handler = (
    stepOrJob: AnyStep | Job,
    input: AsPutStepInput<PutParams>
  ) => {
    stepOrJob.add_on_failure(this.as_put_step(input))
  }

  public as_success_handler = (
    stepOrJob: AnyStep | Job,
    input: AsPutStepInput<PutParams>
  ) => {
    stepOrJob.add_on_success(this.as_put_step(input))
  }

  public as_start_handler = (
    step_or_job: DoStep | Job,
    input: AsPutStepInput<PutParams>
  ) => {
    if (step_or_job instanceof Job) {
      step_or_job.add_step_first(this.as_put_step(input))
    } else {
      step_or_job.add_do_first(this.as_put_step(input))
    }
  }

  serialise() {
    if (!this.type) {
      throw new VError('Cannot serialise resource without a resource type')
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

  public static deserialise(input: Type.Resource, rt: ResourceType) {
    return new Resource(input.name, rt, (r) => {
      r.source = input.source

      if (is_duration(input.check_every)) {
        r.check_every = input.check_every
      }

      r.icon = input.icon
      r.old_name = input.old_name
      r.public = input.public
      r.tags = input.tags
      r.version = input.version
      r.webhook_token = input.webhook_token
    })
  }
}
