import {VError} from 'verror'
import {Serialisable} from '~/declarations/serialisable'
import * as Type from '~/declarations/types'
import {OneMinute} from '~/defaults/durations/one-minute'
import {Resource} from './resource'

export class ResourceType extends Serialisable<Type.ResourceType> {
  constructor(public name: string) {
    super()
  }

  public create_resource = (name: string) => {
    return Resource.from_resource_type(name, this)
  }

  public type = 'registry-image'

  public source?: Type.Config

  private check_every: Type.Duration = OneMinute

  public set_check_every = (input: string) => {
    if (!Type.is_duration(input)) {
      throw new VError(`Duration ${input} is malformed`)
    }

    this.check_every = input
  }

  private defaults?: Type.Config

  public set_default = (key: string, value: Type.YamlValue) => {
    if (!this.defaults) this.defaults = {}

    this.defaults[key] = value
  }

  private params?: Type.Config

  public set_param = (key: string, value: Type.YamlValue) => {
    if (!this.params) this.params = {}

    this.params[key] = value
  }

  public privileged = false

  private tags?: Type.Tags

  public add_tag = (tag: string) => {
    if (!this.tags) this.tags = []

    this.tags.push(tag)
  }

  public unique_version_history = false

  serialise() {
    if (!this.type) {
      throw new VError(
        `Resource type "${this.name}" cannot be serialised without a type.`
      )
    }

    const result: Type.ResourceType = {
      name: this.name,
      type: this.type,
      source: this.source,
      check_every: this.check_every,
      defaults: this.defaults,
      params: this.params,
      privileged: this.privileged,
      tags: this.tags,
      unique_version_history: this.unique_version_history,
    }

    return result
  }
}
