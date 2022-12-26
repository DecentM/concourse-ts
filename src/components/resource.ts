import {VError} from 'verror'
import {Initer} from '~/declarations/initialisable'
import {Serialisable} from '~/declarations/serialisable'
import * as Type from '~/declarations/types'
import {OneMinute} from '~/defaults/durations/one-minute'
import {is_duration} from '~/utils/is-duration'
import {ResourceType} from './resource-type'

export class Resource extends Serialisable<Type.Resource> {
  constructor(
    public name: string,
    private type: ResourceType,
    init?: Initer<Resource>
  ) {
    super()

    if (init) {
      init(this)
    }
  }

  public static from_resource_type(name: string, input: ResourceType) {
    return new Resource(name, input)
  }

  public get_resource_type = () => this.type

  public source?: Type.Config

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
