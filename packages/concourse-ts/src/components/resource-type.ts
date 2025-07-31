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

  private resource_customiser: Customiser<Resource<never, never, never, never, never>>

  public customise_resource = <
    Source extends Declaration.Config = Declaration.Config,
    PutParams extends Declaration.Config = Declaration.Config,
    GetParams extends Declaration.Config = Declaration.Config,
  >(
    customiser: Customiser<Resource<Source, PutParams, GetParams>>
  ) => {
    this.resource_customiser = customiser
  }

  /**
   * The name of the resource type. This should be short and simple. This name
   * will be referenced by `pipeline.resources` defined within the same
   * pipeline, and `task-config.image_resources` used by tasks running in the
   * pipeline.
   *
   * Pipeline-provided resource types can override the core resource types by
   * specifying the same name.
   *
   * https://concourse-ci.org/resource-types.html#schema.resource_type.name
   */
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

  /**
   * Creates a new resource preconfigured with this resource type.
   *
   * https://concourse-ci.org/resources.html
   *
   * @param {string} name
   * @param {Customiser<Resource<Source, PutParams, GetParams>>} customise
   * @returns {Resource<Source, PutParams, GetParams>}
   */
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

  /**
   * The type of the resource used to provide the resource type's container
   * image.
   *
   * This is a bit meta. Usually this value will be `registry-image` as the
   * resource type must result in a container image.
   *
   * A resource type's type can refer to other resource types, and can also use
   * the core type that it's overriding. This is useful for bringing in a newer
   * or forked `registry-image` resource.
   *
   * https://concourse-ci.org/resource-types.html#schema.resource_type.type
   *
   * @param {string | ResourceType} input
   */
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

  /**
   * https://concourse-ci.org/resource-types.html#schema.resource_type.source
   */
  public source?: Source

  private check_every?: Duration

  /**
   * Default 1m. The interval on which to check for new versions of the resource
   * type. Acceptable interval options are defined by the time.ParseDuration
   * function.
   *
   * https://concourse-ci.org/resource-types.html#schema.resource_type.check_every
   *
   * @param {DurationInput | 'never'} input
   */
  public set_check_every = (input: DurationInput | 'never') => {
    if (input === 'never') {
      throw new VError(`Duration "${input}" given to ${this.name} is not allowed`)
    }

    this.check_every = get_duration(input)
  }

  private defaults?: Declaration.Config

  /**
   * The default configuration for the resource type. This varies by resource
   * type, and is a black box to Concourse; it is merged with (duplicate fields
   * are overwritten by) resource.source and passed to the resource at runtime.
   *
   * https://concourse-ci.org/resource-types.html#schema.resource_type.defaults
   *
   * @param {Declaration.Config} defaults
   */
  public set_defaults = (defaults: Declaration.Config) => {
    if (!this.defaults) this.defaults = {}

    this.defaults = {
      ...this.defaults,
      ...defaults,
    }
  }

  private params?: Declaration.Config

  /**
   * Arbitrary config to pass when running the get to fetch the resource type's
   * image.
   *
   * https://concourse-ci.org/resource-types.html#schema.resource_type.params
   *
   * @param {Declaration.Config} params
   */
  public set_params = (params: Declaration.Config) => {
    if (!this.params) this.params = {}

    this.params = {
      ...this.params,
      ...params,
    }
  }

  /**
   * Default false. If set to true, the resource's containers will be run with
   * full capabilities, as determined by the worker backend the task runs on.
   *
   * For Linux-based backends it typically determines whether or not the
   * container will run in a separate user namespace, and whether the root user
   * is "actual" root (if set to true) or a user namespaced root (if set to
   * false, the default).
   *
   * This is a gaping security hole; only configure it if the resource type
   * needs it (which should be called out in its documentation). This is not up
   * to the resource type to decide dynamically, so as to prevent privilege
   * escalation via third-party resource type exploits.
   *
   * https://concourse-ci.org/resource-types.html#schema.resource_type.privileged
   */
  public privileged?: boolean

  private tags?: Declaration.Tags

  /**
   * Adds one or more tags to this resource type.
   *
   * https://concourse-ci.org/tags-step.html#schema.tags
   *
   * @param {string[]} tags
   */
  public add_tag = (...tags: string[]) => {
    if (!this.tags) this.tags = []

    this.tags.push(...tags)
  }

  /**
   * Serialises this resource type into a valid Concourse configuration fixture.
   * The returned value needs to be converted into YAML to be used in Concourse.
   *
   * @returns {Declaration.ResourceType}
   */
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
