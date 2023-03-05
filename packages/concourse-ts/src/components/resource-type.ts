import {VError} from 'verror'

import {Customiser} from '../declarations/customiser'
import {Duration, DurationInput, get_duration} from '../utils/duration'
import {get_identifier, Identifier} from '../utils/identifier'
import * as Declaration from '../declarations/types'
import {Resource} from './resource'

export class ResourceType<
  Type extends Identifier = Identifier,
  Source extends Declaration.Config = Declaration.Config
> {
  private static customiser: Customiser<ResourceType>

  public static customise = (init: Customiser<ResourceType>) => {
    ResourceType.customiser = init
  }

  private resource_customiser: Customiser<Resource>

  public customise_resource = <
    Source extends Declaration.Config = Declaration.Config,
    PutParams extends Declaration.Config = Declaration.Config,
    GetParams extends Declaration.Config = Declaration.Config
  >(
    customiser: Customiser<Resource<Source, PutParams, GetParams>>
  ) => {
    this.resource_customiser = customiser
  }

  public name: Identifier

  constructor(
    name: string,
    customise?: Customiser<ResourceType<Type, Source>>
  ) {
    this.name = get_identifier(name)

    if (ResourceType.customiser) {
      ResourceType.customiser(this)
    }

    if (customise) {
      customise(this)
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

  private type: Type

  public set_type = (input: string) => {
    this.type = get_identifier(input) as Type
  }

  public source?: Source

  private check_every?: Duration

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
