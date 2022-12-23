import * as Type from '~/declarations/types'
import {Serialisable} from '~/declarations/serialisable'
import {Initer, Initialisable} from '~/declarations/initialisable'

export class Pipeline extends Serialisable<Type.Pipeline> {
  constructor(init?: Initer<Pipeline>) {
    super()

    if (init) {
      init(this)
    }
  }

  public jobs: Type.Job[] = []

  public display: Type.DisplayConfig = {}

  public groups: Type.GroupConfig[] = []

  public resource_types: Type.ResourceType[] = []

  public resources: Type.Resource[] = []

  public var_sources: Type.VarSource[] = []

  serialise() {
    const result: Type.Pipeline = {
      jobs: this.jobs,
      display: this.display,
      groups: this.groups,
      resource_types: this.resource_types,
      resources: this.resources,
      var_sources: this.var_sources,
    }

    return result
  }
}
