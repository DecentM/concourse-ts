import {VError} from 'verror'

import {Initer} from '../declarations/initialisable'
import * as Type from '../declarations/types'

import {DurationInput, get_duration, is_duration} from '../utils/duration'

import {ResourceType} from './resource-type'
import {AnyStep, DoStep, GetStep, PutStep} from './step'
import {Job} from './job'

export class Resource<
  SourceType extends Type.Config = Type.Config,
  PutParams extends Type.Config = Type.Config,
  GetParams extends Type.Config = Type.Config
> {
  constructor(
    public name: string,
    private type: ResourceType,
    init?: Initer<Resource<SourceType, PutParams, GetParams>>
  ) {
    if (name.includes(' ')) {
      throw new VError(
        `Resource name ${name} is not valid. Spaces are not allowed.`
      )
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

  public source?: SourceType

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

  public as_put_step = (params: PutParams) => {
    return new PutStep<PutParams>(`${this.name}_put`, (step) => {
      step.set_put(this)
      step.set_params(params)
    })
  }

  public as_get_step = (params: GetParams) => {
    return new GetStep<GetParams>(`${this.name}_get`, (step) => {
      step.set_get(this)
      step.set_params(params)
    })
  }

  public as_abort_handler = (stepOrJob: AnyStep | Job, params: PutParams) => {
    stepOrJob.add_on_abort(this.as_put_step(params))
  }

  public as_error_handler = (stepOrJob: AnyStep | Job, params: PutParams) => {
    stepOrJob.add_on_error(this.as_put_step(params))
  }

  public as_failure_handler = (stepOrJob: AnyStep | Job, params: PutParams) => {
    stepOrJob.add_on_failure(this.as_put_step(params))
  }

  public as_success_handler = (stepOrJob: AnyStep | Job, params: PutParams) => {
    stepOrJob.add_on_success(this.as_put_step(params))
  }

  public as_start_handler = (stepOrJob: DoStep | Job, params: PutParams) => {
    if (stepOrJob instanceof Job) {
      stepOrJob.add_step_first(this.as_put_step(params))
    } else {
      stepOrJob.add_do_first(this.as_put_step(params))
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
