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

  /**
   * Adds a Job to this pipeline after already added jobs.
   * Providing a group is required if existing jobs are grouped. Do not provide
   * a group if already added jobs on this pipeline are not grouped.
   *
   * ----
   *
   * Simple example:
   * ```typescript
   * const pipeline = new Pipeline()
   * const my_job = new Job(...)
   *
   * pipeline.add_job(my_job)
   * ```
   *
   * ----
   *
   * Grouped example:
   * ```typescript
   * type Group = 'build' | 'release'
   *
   * // Create the pipeline. Note that even if the group type is specified,
   * // jobs will only be grouped if they're added with a group.
   * const pipeline = new Pipeline<Group>()
   * const my_job = new Job(...)
   *
   * // Adds the job to the pipeline with the `build` group
   * pipeline.add_job(my_job, 'build')
   * ```
   *
   * ----
   *
   * https://concourse-ci.org/pipelines.html#schema.pipeline.jobs
   *
   * @param {Job} job The job to add
   * @param {Group} group If specified, the job will be added to this group
   * @returns {void}
   */
  public add_job = (job: Job, group?: Group) => {
    this.jobs.push(job)

    if (!group) return

    if (!this.groups) this.groups = []

    const group_name = get_identifier(group)

    // Find the group this job belongs to, and if there isn't one, push a new
    // group to the groups list
    const groupIndex = this.groups.findIndex(
      (group_config) => group_config.name === group_name
    )

    if (groupIndex === -1) {
      this.groups.push({
        name: group_name,
        jobs: [get_identifier(job.name)],
      })

      return
    }

    this.groups[groupIndex] = {
      name: group_name,
      jobs: [...this.groups[groupIndex].jobs, get_identifier(job.name)],
    }
  }

  private display?: Type.Pipeline['display']

  /**
   * Sets the given URL as the background image of the pipeline in Concourse's
   * UI. Has no effect on builds.
   *
   * https://concourse-ci.org/pipelines.html#schema.display_config.background_image
   *
   * @param {string} url URL to the image file, must be an absolute, direct link
   * to a browser-compatible image file (redirects allowed).
   */
  public set_background_image_url = (url: string) => {
    if (!this.display) this.display = {}

    this.display.background_image = url
  }

  private groups?: Type.Pipeline['groups']

  private var_sources?: Type.VarSource[]

  /**
   * Adds one or more [Var
   * Sources](https://concourse-ci.org/vars.html#var-sources) to this pipeline.
   *
   * https://concourse-ci.org/pipelines.html#schema.pipeline.var_sources
   *
   * @param var_sources
   */
  public add_var_source = (...var_sources: Type.VarSource[]) => {
    if (!this.var_sources) this.var_sources = []

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
    const result: ResourceType[] = []

    this.get_resources().forEach((r) => {
      result.push(...r.get_resource_types())
    })

    return result
  }

  /**
   * @internal Used by the compiler
   * @returns {Task[]}
   */
  public get_tasks = (): Task[] => {
    return this.get_task_steps().map((task_step) => {
      return task_step.get_task()
    })
  }

  /**
   * @internal Used by the compiler
   * @returns {TaskStep[]}
   */
  public get_task_steps = () => {
    const result: TaskStep[] = []

    this.jobs.forEach((job) => {
      result.push(...job.get_task_steps())
    })

    return result
  }

  /**
   * Serialises this Pipeline into a valid Concourse configuration fixture. The
   * returned value needs to be converted into YAML to be used in Concourse.
   *
   * @returns {Type.Pipeline} A JSON representation of this Job
   */
  public serialise() {
    const resource_types = deduplicate_by_identity(
      this.get_resource_types()
    ).map((rt) => rt.serialise())

    const resources = deduplicate_by_identity(this.get_resources()).map((r) =>
      r.serialise()
    )

    const result: Type.Pipeline = {
      jobs: this.jobs.map((j) => j.serialise()),
      display: this.display,
      groups: this.groups,
      resource_types: resource_types.length ? resource_types : undefined,
      resources: resources.length ? resources : undefined,
      var_sources: this.var_sources,
    }

    return result
  }
}
