import {VError} from 'verror'
import {Initer} from '../declarations/initialisable'
import {Serialisable} from '../declarations/serialisable'
import * as Type from '../declarations/types'
import {is_duration} from '../utils'
import {Resource} from './resource'

export class ResourceType<
  SourceType extends Type.Config = Type.Config
> extends Serialisable<Type.ResourceType> {
  constructor(public name: string, init?: Initer<ResourceType<SourceType>>) {
    super()

    if (init) {
      init(this)
    }
  }

  public create_resource = (name: string): Resource => {
    return Resource.from_resource_type(name, this)
  }

  public type = 'registry-image'

  public source?: SourceType

  private check_every?: Type.Duration

  public set_check_every = (input: Type.Duration) => {
    if (!is_duration(input)) {
      throw new VError(`Duration ${input} is malformed`)
    }

    this.check_every = input
  }

  private defaults?: Type.Config

  public set_default = (...defaults: Type.Param[]) => {
    if (!this.defaults) this.defaults = {}

    defaults.forEach((item) => {
      this.defaults[item.key] = item.value
    })
  }

  private params?: Type.Config

  public set_param = (...params: Type.Param[]) => {
    if (!this.params) this.params = {}

    params.forEach((param) => {
      this.params[param.key] = param.value
    })
  }

  public privileged = false

  private tags?: Type.Tags

  public add_tag = (...tags: string[]) => {
    if (!this.tags) this.tags = []

    this.tags.push(...tags)
  }

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
    }

    return result
  }
}
