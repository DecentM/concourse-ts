import {Serialisable} from '~/declarations/serialisable'
import * as Type from '~/declarations/types'
import {Resource} from './resource'

export class ResourceType extends Serialisable<Type.ResourceType> {
  constructor(public name: string) {
    super()
  }

  public create_resource = (name: string) => {
    return Resource.from_resource_type(name, this)
  }

  public type = ''

  public source: Type.Config = {}

  public check_every: string | undefined

  public defaults: Type.Config = {}

  public params: Type.Config = {}

  public privileged = false

  public tags: Type.Tags = []

  public unique_version_history = false

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
      unique_version_history: this.unique_version_history,
    }

    return result
  }
}
