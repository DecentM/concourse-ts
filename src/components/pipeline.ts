import * as Type from '~/declarations/types'
import {Serialisable} from '~/declarations/serialisable'
import {Initer, Initialisable} from '~/declarations/initialisable'
import {Resource} from './resource'
import {Job} from './job'

export class Pipeline extends Serialisable<Type.Pipeline> {
  constructor(init?: Initer<Pipeline>) {
    super()

    if (init) {
      init(this)
    }
  }

  private jobs?: Job[]

  public add_job = (input: Job) => {
    if (!this.jobs) this.jobs = []

    this.jobs.push(input)
  }

  private display?: Type.DisplayConfig

  public set_background_image_url = (url: string) => {
    if (!this.display) this.display = {}

    this.display.background_image = url
  }

  private groups?: Type.GroupConfig[]

  public add_group = (input: Type.GroupConfig) => {
    if (!this.groups) this.groups = []

    this.groups.push(input)
  }

  private resources?: Resource[]

  public add_resource = (input: Resource) => {
    if (!this.resources) this.resources = []

    this.resources.push(input)
  }

  private var_sources?: Type.VarSource[]

  public add_var_source = (var_source: Type.VarSource) => {
    if (!this.var_sources) this.var_sources = []

    this.var_sources.push(var_source)
  }

  serialise() {
    const result: Type.Pipeline = {
      jobs: this.jobs.map((j) => j.serialise()),
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
