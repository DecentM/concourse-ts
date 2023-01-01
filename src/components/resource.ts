import {VError} from 'verror'
import {Initer} from '~/declarations/initialisable'
import {Serialisable} from '~/declarations/serialisable'
import * as Type from '~/declarations/types'
import {OneMinute} from '~/defaults/durations/one-minute'
import {is_duration} from '~/utils/duration'
import {ResourceType} from './resource-type'
import {GetStep, PutStep, TaskStep} from './step'

export class Resource<
  SourceType extends Type.Config = Type.Config,
  PutParams extends Type.Config = Type.Config,
  GetParams extends Type.Config = Type.Config
> extends Serialisable<Type.Resource> {
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

    super()

    if (init) {
      init(this)
    }
  }

  public static from_resource_type(name: string, input: ResourceType) {
    return new Resource(name, input)
  }

  public get_resource_type = () => this.type

  public source?: SourceType

  private check_every?: Type.Duration = OneMinute

  public set_check_every = (input: string) => {
    // Accepts Duration or "never". Regular Duration does not have a concept for
    // "never", this is a local override.
    //
    // concourse-ci.org/resources.html#schema.resource.check_every
    if (!is_duration(input, ['never'])) {
      throw new VError(`Duration ${input} is malformed`)
    }

    this.check_every = input
  }

  public icon?: string

  public old_name?: string

  public public = false

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
}
