import {VError} from 'verror'

import {Initer} from '../declarations/initialisable'
import * as Type from '../declarations/types'
import {DurationInput, get_duration} from '../utils'
import {Resource} from './resource'

export class ResourceType<SourceType extends Type.Config = Type.Config> {
  private static customiser: Initer<ResourceType>

  public static customise = (init: Initer<ResourceType>) => {
    ResourceType.customiser = init
  }

  constructor(public name: string, init?: Initer<ResourceType<SourceType>>) {
    if (ResourceType.customiser) {
      ResourceType.customiser(this)
    }

    if (init) {
      init(this)
    }
  }

  public create_resource = (name: string): Resource => {
    return Resource.from_resource_type(name, this)
  }

  public type: string

  public source?: SourceType

  private check_every?: Type.Duration

  public set_check_every = (input: DurationInput | 'never') => {
    if (input === 'never') {
      throw new VError(
        `Duration "${input}" given to ${this.name} is not allowed`
      )
    }

    this.check_every = get_duration(input)
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

  public privileged: boolean

  private tags?: Type.Tags

  public add_tag = (...tags: string[]) => {
    if (!this.tags) this.tags = []

    this.tags.push(...tags)
  }

  serialise() {
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

  public static deserialise(input: Type.ResourceType) {
    return new ResourceType(input.name, (rt) => {
      rt.type = input.type
      rt.source = input.source
      rt.check_every = input.check_every
      rt.defaults = input.defaults
      rt.params = input.params
      rt.privileged = input.privileged
      rt.tags = input.tags
    })
  }
}
