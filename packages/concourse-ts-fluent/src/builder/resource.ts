import * as ConcourseTs from '@decentm/concourse-ts'
import VError from 'verror'

import { ResourceTypeBuilder } from './resource-type'

export class ResourceBuilder<
  Source extends ConcourseTs.Type.Config = ConcourseTs.Type.Config,
  PutParams extends ConcourseTs.Type.Config = ConcourseTs.Type.Config,
  GetParams extends ConcourseTs.Type.Config = ConcourseTs.Type.Config,
> {
  public build(): ConcourseTs.Resource<Source, PutParams, GetParams> {
    if (!this._name) {
      throw new VError('Cannot build resource without a name')
    }

    if (!this._type) {
      throw new VError(`Cannot build resource "${this._name}" without a type`)
    }

    const resource = new ConcourseTs.Resource<Source, PutParams, GetParams>(
      this._name,
      this._type
    )

    if (this._source) resource.source = this._source
    if (this._check_every) resource.set_check_every(this._check_every)
    if (this._icon) resource.icon = this._icon
    if (this._old_name) resource.old_name = this._old_name
    if (this._public) resource.public = this._public
    if (this._tags.length) resource.add_tag(...this._tags)
    if (this._version) resource.set_version(this._version)
    if (this._webhook_token) resource.webhook_token = this._webhook_token

    return resource
  }

  private _type: ConcourseTs.ResourceType

  public type<
    Type extends string = string,
    TypeSource extends ConcourseTs.Type.Config = ConcourseTs.Type.Config,
  >(
    customise_or_type:
      | ConcourseTs.ResourceType<Type, TypeSource>
      | ConcourseTs.Type.Customiser<ResourceTypeBuilder>
  ): ResourceBuilder<Source, PutParams, GetParams> {
    if (customise_or_type instanceof ConcourseTs.ResourceType) {
      this._type = customise_or_type

      return this
    }

    const type_builder = new ResourceTypeBuilder()
    customise_or_type(type_builder)

    this._type = type_builder.build()

    return this
  }

  private _name: string

  public name(name: string): ResourceBuilder<Source, PutParams, GetParams> {
    this._name = name

    return this
  }

  private _source: Source

  public source(source: Source): ResourceBuilder<Source, PutParams, GetParams> {
    this._source = source

    return this
  }

  private _check_every: ConcourseTs.Utils.DurationInput | 'never'

  public check_every(
    duration_input: ConcourseTs.Utils.DurationInput | 'never'
  ): ResourceBuilder<Source, PutParams, GetParams> {
    this._check_every = duration_input

    return this
  }

  private _icon: string

  public icon(icon: string): ResourceBuilder<Source, PutParams, GetParams> {
    this._icon = icon

    return this
  }

  private _old_name: string

  public old_name(old_name: string): ResourceBuilder<Source, PutParams, GetParams> {
    this._old_name = old_name

    return this
  }

  private _public: boolean

  public public(): ResourceBuilder<Source, PutParams, GetParams> {
    this._public = true

    return this
  }

  private _tags: string[] = []

  public tag(...tags: string[]): ResourceBuilder<Source, PutParams, GetParams> {
    this._tags.push(...tags)

    return this
  }

  private _version: ConcourseTs.Type.Version

  public version(
    version: ConcourseTs.Type.Version
  ): ResourceBuilder<Source, PutParams, GetParams> {
    this._version = version

    return this
  }

  private _webhook_token: string

  public webhook_token(
    token: string
  ): ResourceBuilder<Source, PutParams, GetParams> {
    this._webhook_token = token

    return this
  }
}
