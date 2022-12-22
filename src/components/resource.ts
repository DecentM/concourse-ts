import {Serialisable} from '~/declarations/serialisable'
import * as Type from '~/declarations/types'

export class Resource extends Serialisable<Type.Resource> {
  constructor(private name: string) {
    super()
  }

  public type = ''

  public source: Type.Config = {}

  public check_every: string | undefined

  public icon: string | undefined

  public old_name: string | undefined

  public public = false

  public tags: Type.Tags = []

  public version: Type.Version = {}

  public webhook_token: string | undefined

  serialise() {
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
