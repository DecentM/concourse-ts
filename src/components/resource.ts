import {VError} from 'verror'
import {Initer} from '~/declarations/initialisable'
import {Serialisable} from '~/declarations/serialisable'
import * as Type from '~/declarations/types'
import {OneMinute} from '~/defaults/durations/one-minute'
import {ResourceType} from './resource-type'

export class Resource extends Serialisable<Type.Resource> {
  constructor(
    private name: string,
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

  public source: Type.Config = {}

  private check_every: Type.Duration = OneMinute

  public set_check_every = (input: string) => {
    if (!Type.is_duration(input)) {
      throw new VError(`Duration ${input} is malformed`)
    }

    this.check_every = input
  }

  public icon: string | undefined

  public old_name: string | undefined

  public public = false

  private tags: Type.Tags = []

  public add_tag = (tag: string) => {
    this.tags.push(tag)
  }

  private version: Type.Version = {}

  public set_version = (version: string, value: string) => {
    this.version[version] = value
  }

  public webhook_token: string | undefined

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
