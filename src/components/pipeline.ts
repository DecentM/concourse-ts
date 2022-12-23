import * as Type from '~/declarations/types'
import {Serialisable} from '~/declarations/serialisable'
import {Initer, Initialisable} from '~/declarations/initialisable'
import {Resource} from './resource'

export class Pipeline extends Serialisable<Type.Pipeline> {
  constructor(init?: Initer<Pipeline>) {
    super()

    if (init) {
      init(this)
    }
  }

  private jobs: Type.Job[] = []

  public add_job = (input: Type.Job) => {
    this.jobs.push(input)
  }

  private display: Type.DisplayConfig = {}

  public set_background_image_url = (url: string) => {
    this.display.background_image = url
  }

  private groups: Type.GroupConfig[] = []

  public add_group = (input: Type.GroupConfig) => {
    this.groups.push(input)
  }

  private resources: Resource[] = []

  public add_resource = (input: Resource) => {
    this.resources.push(input)
  }

  public var_sources: Type.VarSource[] = []

  serialise() {
    const result: Type.Pipeline = {
      jobs: this.jobs,
      display: this.display,
      groups: this.groups,
      resource_types: this.resources.map((r) =>
        r.get_resource_type().serialise()
      ),
      resources: this.resources.map((r) => r.serialise()),
      var_sources: this.var_sources,
    }

    return result
  }
}
