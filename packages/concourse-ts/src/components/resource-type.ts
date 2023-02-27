import {VError} from 'verror'

import {Initer} from '../declarations/initialisable'
import * as Declaration from '../declarations/types'
import {DurationInput, get_duration} from '../utils'
import {Resource} from './resource'

export class ResourceType<
  Type extends string = string,
  Source extends Declaration.Config = Declaration.Config
> {
  private static customiser: Initer<ResourceType>

  public static customise = (init: Initer<ResourceType>) => {
    ResourceType.customiser = init
  }

  private resource_customiser: Initer<Resource>

  public customise_resource = <
    Source extends Declaration.Config = Declaration.Config,
    PutParams extends Declaration.Config = Declaration.Config,
    GetParams extends Declaration.Config = Declaration.Config
  >(
    customiser: Initer<Resource<Source, PutParams, GetParams>>
  ) => {
    this.resource_customiser = customiser
  }

  constructor(public name: string, init?: Initer<ResourceType<Type, Source>>) {
    if (ResourceType.customiser) {
      ResourceType.customiser(this)
    }

    if (init) {
      init(this)
    }
  }

  public create_resource = <
    Source extends Declaration.Config = Declaration.Config,
    PutParams extends Declaration.Config = Declaration.Config,
    GetParams extends Declaration.Config = Declaration.Config
  >(
    name: string
  ): Resource<Source, PutParams, GetParams> => {
    return new Resource<Source, PutParams, GetParams>(
      name,
      this,
      this.resource_customiser
    )
  }

  public type: Type

  public source?: Source

  private check_every?: Declaration.Duration

  public set_check_every = (input: DurationInput | 'never') => {
    if (input === 'never') {
      throw new VError(
        `Duration "${input}" given to ${this.name} is not allowed`
      )
    }

    this.check_every = get_duration(input)
  }

  private defaults?: Declaration.Config

  public set_default = (...defaults: Declaration.Param[]) => {
    if (!this.defaults) this.defaults = {}

    defaults.forEach((item) => {
      this.defaults[item.key] = item.value
    })
  }

  private params?: Declaration.Config

  public set_param = (...params: Declaration.Param[]) => {
    if (!this.params) this.params = {}

    params.forEach((param) => {
      this.params[param.key] = param.value
    })
  }

  public privileged: boolean

  private tags?: Declaration.Tags

  public add_tag = (...tags: string[]) => {
    if (!this.tags) this.tags = []

    this.tags.push(...tags)
  }

  serialise() {
    const result: Declaration.ResourceType = {
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

  public static deserialise(input: Declaration.ResourceType) {
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
