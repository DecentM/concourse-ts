import * as ConcourseTs from '@decentm/concourse-ts'
import VError from 'verror'

export class ResourceTypeBuilder<
  Type extends string = string,
  Source extends ConcourseTs.Type.Config = ConcourseTs.Type.Config,
> {
  public build(): ConcourseTs.ResourceType<Type, Source> {
    const resource_type = new ConcourseTs.ResourceType<Type, Source>(this._name)

    if (!this._name) {
      throw new VError(`Cannot build resource type without a name`)
    }

    if (!this._type) {
      throw new VError(`Cannot build resource type "${this._name}" without a type`)
    }

    if (this._type) resource_type.set_type(this._type)
    if (this._source) resource_type.source = this._source
    if (this._check_every) resource_type.set_check_every(this._check_every)
    if (this._defaults) resource_type.set_defaults(this._defaults)
    if (this._params) resource_type.set_params(this._params)
    if (typeof this._privileged === 'boolean')
      resource_type.privileged = this._privileged
    if (this._tags.length) resource_type.add_tag(...this._tags)

    return resource_type
  }

  private _name: string

  public name(name: string): ResourceTypeBuilder<Type, Source> {
    this._name = name

    return this
  }

  private _type: Type | ConcourseTs.ResourceType

  public type(
    input: Type | ConcourseTs.ResourceType
  ): ResourceTypeBuilder<Type, Source> {
    this._type = input

    return this
  }

  private _source: Source

  public source(source: Source): ResourceTypeBuilder<Type, Source> {
    this._source = source

    return this
  }

  private _check_every: ConcourseTs.Utils.DurationInput | 'never'

  public check_every(input: ConcourseTs.Utils.DurationInput | 'never') {
    this._check_every = input

    return this
  }

  private _defaults: ConcourseTs.Type.Config

  public defaults(
    defaults: ConcourseTs.Type.Config
  ): ResourceTypeBuilder<Type, Source> {
    this._defaults = defaults

    return this
  }

  private _params: ConcourseTs.Type.Config

  public params(params: ConcourseTs.Type.Config): ResourceTypeBuilder<Type, Source> {
    this._params = params

    return this
  }

  private _privileged: boolean

  public privileged(): ResourceTypeBuilder<Type, Source> {
    this._privileged = true

    return this
  }

  private _tags: string[] = []

  public tag(...tags: string[]): ResourceTypeBuilder<Type, Source> {
    this._tags.push(...tags)

    return this
  }
}
