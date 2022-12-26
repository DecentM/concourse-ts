import * as Type from '~/declarations/types'
import {Serialisable} from '~/declarations/serialisable'
import {Initer} from '~/declarations/initialisable'
import {Resource} from './resource'
import {Job} from './job'
import { deduplicate_by_key } from '~/utils/array-duplicates'

export class Pipeline extends Serialisable<Type.Pipeline> {
  constructor(public name: string, init?: Initer<Pipeline>) {
    super()

    if (init) {
      init(this)
    }
  }

  private jobs?: Job[]

  public add_job = (...inputs: Job[]) => {
    if (!this.jobs) this.jobs = []

    this.jobs.push(...inputs)
  }

  private display?: Type.DisplayConfig

  public set_background_image_url = (url: string) => {
    if (!this.display) this.display = {}

    this.display.background_image = url
  }

  private groups?: Type.GroupConfig[]

  public add_group = (...inputs: Type.GroupConfig[]) => {
    if (!this.groups) this.groups = []

    this.groups.push(...inputs)
  }

  private resources?: Resource[]

  public add_resource = (...inputs: Resource[]) => {
    if (!this.resources) this.resources = []

    this.resources.push(...inputs)
  }

  private var_sources?: Type.VarSource[]

  public add_var_source = (...var_sources: Type.VarSource[]) => {
    if (!this.var_sources) this.var_sources = []

    this.var_sources.push(...var_sources)
  }

  serialise() {
    const result: Type.Pipeline = {
      jobs: this.jobs?.map((j) => j.serialise()),
      display: this.display,
      groups: this.groups,
      resource_types: deduplicate_by_key(
        'name',
        this.resources?.map((r) => r.get_resource_type().serialise())
      ),
      resources: this.resources?.map((r) => r.serialise()),
      var_sources: this.var_sources,
    }

    return result
  }
}
