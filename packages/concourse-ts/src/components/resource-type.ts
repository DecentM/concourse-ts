import VError from 'verror'

import { Customiser } from '../declarations/customiser.js'
import { Duration, DurationInput, get_duration } from '../utils/duration/index.js'
import { get_identifier } from '../utils/identifier/index.js'
import * as Declaration from '../declarations/types.js'

import { Resource } from './resource.js'

export class ResourceType<
  Type extends string = string,
  Source extends Declaration.Config = Declaration.Config,
> {
  private static customiser: Customiser<ResourceType>

  public static customise = (init: Customiser<ResourceType>) => {
    ResourceType.customiser = init
  }

  private resource_customiser: Customiser<Resource>

  public customise_resource = <
    Source extends Declaration.Config = Declaration.Config,
    PutParams extends Declaration.Config = Declaration.Config,
    GetParams extends Declaration.Config = Declaration.Config,
  >(
    customiser: Customiser<Resource<Source, PutParams, GetParams>>
  ) => {
    this.resource_customiser = customiser
  }

  public name: string

  constructor(name: string, customise?: Customiser<ResourceType<Type, Source>>) {
    this.name = name

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
    GetParams extends Declaration.Config = Declaration.Config,
  >(
    name: string,
    customise?: Customiser<Resource<Source, PutParams, GetParams>>
  ): Resource<Source, PutParams, GetParams> => {
    const result = new Resource<Source, PutParams, GetParams>(
      name,
      this,
      this.resource_customiser
    )

    if (customise) {
      customise(result)
    }

    return result
  }

  private type: Type | ResourceType

  public set_type = (input: Type | ResourceType) => {
    this.type = input
  }

  /**
   * @internal Used by the compiler
   */
  public get_type = (): ResourceType | null => {
    if (typeof this.type === 'string') {
      return null
    }

    return this.type
  }

  public source?: Source

  private check_every?: Duration

  public set_check_every = (input: DurationInput | 'never') => {
    if (input === 'never') {
      throw new VError(`Duration "${input}" given to ${this.name} is not allowed`)
    }

    this.check_every = get_duration(input)
  }

  private defaults?: Declaration.Config

  public set_defaults = (defaults: Declaration.Config) => {
    if (!this.defaults) this.defaults = {}

    this.defaults = {
      ...this.defaults,
      ...defaults,
    }
  }

  private params?: Declaration.Config

  public set_params = (params: Declaration.Config) => {
    if (!this.params) this.params = {}

    this.params = {
      ...this.params,
      ...params,
    }
  }

  public privileged?: boolean

  private tags?: Declaration.Tags

  public add_tag = (...tags: string[]) => {
    if (!this.tags) this.tags = []

    this.tags.push(...tags)
  }

  public serialise() {
    const result: Declaration.ResourceType = {
      name: get_identifier(this.name),
      type: get_identifier(
        typeof this.type === 'string' ? this.type : this.type.name
      ),
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
