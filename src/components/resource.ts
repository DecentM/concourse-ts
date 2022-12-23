import {VError} from 'verror'
import {Initer} from '~/declarations/initialisable'
import {Serialisable} from '~/declarations/serialisable'
import * as Type from '~/declarations/types'
import {ResourceType} from './resource-type'

export class Resource extends Serialisable<Type.Resource> {
  constructor(private name: string, init?: Initer<Resource>) {
    super()

    if (init) {
      init(this)
    }
  }

  public static from_resource_type(name: string, input: ResourceType) {
    const resource = new Resource(name)

    resource.type = input.name

    return resource
  }

  private type: string | undefined

  public source: Type.Config = {}

  public check_every: string | undefined

  public icon: string | undefined

  public old_name: string | undefined

  public public = false

  public tags: Type.Tags = []

  public version: Type.Version = {}

  public webhook_token: string | undefined

  serialise() {
    if (!this.type) {
      throw new VError('Cannot serialise resource without a resource type.')
    }

    const result: Type.Resource = {
      name: this.name,
      type: this.type,
      source: this.source,
      check_every: this.check_every,
      icon: this.icon,
      old_name: this.old_name,
      public: this.public,
      tags: this.tags,
      version: this.version,
      webhook_token: this.webhook_token,
    }

    return result
  }
}
