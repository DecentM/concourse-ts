import * as Type from '../declarations/types'
import {Customiser} from '../declarations/customiser'
import {Resource} from './resource'
import {Job} from './job'
import {ResourceType} from './resource-type'
import {deduplicate_by_identity} from '../utils/array-duplicates'
import {Task} from './task'
import {TaskStep} from './step'
import {get_identifier} from '../utils/identifier'

export class Pipeline<Group extends string = string> {
  private static customiser: Customiser<Pipeline>

  public static customise = (init: Customiser<Pipeline>) => {
    Pipeline.customiser = init
  }

  constructor(public name: string, customise?: Customiser<Pipeline<Group>>) {
    if (Pipeline.customiser) {
      Pipeline.customiser(this)
    }

    if (customise) {
      customise(this)
    }
  }

  private jobs?: Job[] = []

  public add_job = (job: Job, group?: Group) => {
    this.jobs.push(job)

    if (!group) return

    const group_name = get_identifier(group)

    // Find the group this job belongs to, and if there isn't one, push a new
    // group to the groups list
    const groupIndex = this.groups.findIndex(
      (group_config) => group_config.name === group_name
    )

    if (groupIndex === -1) {
      this.groups.push({
        name: group_name,
        jobs: [job.name],
      })

      return
    }

    this.groups[groupIndex] = {
      name: group_name,
      jobs: [...this.groups[groupIndex].jobs, job.name],
    }
  }

  private display?: Type.Pipeline['display']

  public set_background_image_url = (url: string) => {
    if (!this.display) this.display = {}

    this.display.background_image = url
  }

  private groups?: Type.Pipeline['groups'] = []

  private var_sources?: Type.VarSource[] = []

  public add_var_source = (...var_sources: Type.VarSource[]) => {
    this.var_sources.push(...var_sources)
  }

  private get_resources(): Resource[] {
    const result: Resource[] = []

    if (!this.jobs || this.jobs.length < 1) {
      return result
    }

    this.jobs.forEach((job) => {
      result.push(...job.get_resources())
    })

    return result
  }

  private get_resource_types(): ResourceType[] {
    return this.get_resources().map((r) => r.get_resource_type())
  }

  public get_tasks = (): Task[] => {
    return this.get_task_steps().map((task_step) => {
      return task_step.get_task()
    })
  }

  public get_task_steps = () => {
    const result: TaskStep[] = []

    this.jobs.forEach((job) => {
      result.push(...job.get_task_steps())
    })

    return result
  }

  serialise() {
    const result: Type.Pipeline = {
      jobs: this.jobs.map((j) => j.serialise()),
      display: this.display,
      groups: this.groups,
      resource_types: deduplicate_by_identity(this.get_resource_types()).map(
        (rt) => rt.serialise()
      ),
      resources: deduplicate_by_identity(this.get_resources()).map((r) =>
        r.serialise()
      ),
      var_sources: this.var_sources,
    }

    return result
  }
}
