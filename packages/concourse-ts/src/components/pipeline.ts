import * as Type from '../declarations/types'
import {Serialisable} from '../declarations/serialisable'
import {Initer} from '../declarations/initialisable'
import {Resource} from './resource'
import {Job} from './job'
import {ResourceType} from './resource-type'
import {deduplicate_by_identity} from '../utils/array-duplicates'

export class Pipeline<
  Group extends string = string
> extends Serialisable<Type.Pipeline> {
  constructor(public name: string, init?: Initer<Pipeline<Group>>) {
    super()

    if (init) {
      init(this)
    }
  }

  private jobs?: Job[]

  public add_job = (job: Job, group?: Group) => {
    if (!this.jobs) this.jobs = []

    this.jobs.push(job)

    if (!group) return

    // Find the group this job belongs to, and if there isn't one, push a new
    // group to the groups list
    const groupIndex = this.groups.findIndex(
      (groupConfig) => groupConfig.name === group
    )

    if (groupIndex === -1) {
      this.groups.push({
        name: group,
        jobs: [job.name],
      })

      return
    }

    this.groups[groupIndex] = {
      name: group,
      jobs: [...this.groups[groupIndex].jobs, job.name],
    }
  }

  private display?: Type.DisplayConfig

  public set_background_image_url = (url: string) => {
    if (!this.display) this.display = {}

    this.display.background_image = url
  }

  private groups?: Type.GroupConfig<Group>[]

  private var_sources?: Type.VarSource[]

  public add_var_source = (...var_sources: Type.VarSource[]) => {
    if (!this.var_sources) this.var_sources = []

    this.var_sources.push(...var_sources)
  }

  private get resources(): Resource[] {
    const result: Resource[] = []

    if (!this.jobs || this.jobs.length < 1) {
      return result
    }

    this.jobs.forEach((job) => {
      result.push(...job.get_resources())
    })

    return result
  }

  private get resource_types(): ResourceType[] {
    return this.resources?.map((r) => r.get_resource_type())
  }

  serialise() {
    const result: Type.Pipeline = {
      jobs: this.jobs?.map((j) => j.serialise()),
      display: this.display,
      groups: this.groups,
      resource_types: deduplicate_by_identity(this.resource_types).map((rt) =>
        rt.serialise()
      ),
      resources: deduplicate_by_identity(this.resources).map((r) =>
        r.serialise()
      ),
      var_sources: this.var_sources,
    }

    return result
  }
}
