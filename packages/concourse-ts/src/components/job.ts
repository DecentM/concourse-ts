import {Customiser} from '../declarations/customiser'
import {get_identifier, Identifier} from '../utils/identifier'
import * as Type from '../declarations/types'

import {Resource} from './resource'
import {AnyStep, DoStep, TaskStep} from './step'
import {Step} from './step/_base'

/**
 * https://concourse-ci.org/jobs.html
 */
export class Job {
  private static customiser: Customiser<Job>

  /**
   * Sets a customiser function onto all jobs created after this call. If a
   * customiser already exists, it will be overwritten.
   *
   * @param {Customiser<Job>} init Your customiser function. It receives a Job
   * instance whenever a Job is constructed.
   */
  public static customise = (init: Customiser<Job>) => {
    Job.customiser = init
  }

  public name: Identifier

  /**
   * Constructs a new Job
   *
   * https://concourse-ci.org/jobs.html
   *
   * @param {string} name The name of the step. This will be visible in the Concourse UI.
   * @param {Customiser<Job>} init Optional customiser function that runs during construction.
   */
  constructor(name: string, customise?: Customiser<Job>) {
    this.name = get_identifier(name)

    if (Job.customiser) {
      Job.customiser(this)
    }

    if (customise) {
      customise(this)
    }
  }

  private plan?: AnyStep[]

  /**
   * Adds one or more steps to the Job. They will be executed in the same order
   * as they are passed.
   *
   * @param {...AnyStep[]} steps Steps to add to the Job in order.
   */
  public add_step = (...steps: AnyStep[]) => {
    if (!this.plan) this.plan = []

    this.plan.push(...steps)
  }

  /**
   * Adds one or more steps before the current ones to the Job. They will be
   * executed in the same order they're passed, but before other steps that
   * exist on this Job.
   *
   * @param steps @param {...AnyStep[]} steps Steps to add to the beginning of
   * the Job in order.
   */
  public add_step_first = (...steps: AnyStep[]) => {
    if (!this.plan) this.plan = []

    this.plan.unshift(...steps)
  }

  /**
   * https://concourse-ci.org/jobs.html#schema.job.build_log_retention
   */
  public build_log_retention?: Type.BuildLogRetentionPolicy

  /**
   * https://concourse-ci.org/jobs.html#schema.job.disable_manual_trigger
   */
  public disable_manual_trigger?: boolean

  /**
   * https://concourse-ci.org/jobs.html#schema.job.interruptible
   */
  public interruptible?: boolean

  /**
   * https://concourse-ci.org/jobs.html#schema.job.max_in_flight
   */
  public max_in_flight?: number

  private old_name?: Identifier

  /**
   * https://concourse-ci.org/jobs.html#schema.job.old_name
   *
   * @param {string} old_name The name this step used to have
   */
  public set_old_name = (old_name: string) => {
    this.old_name = get_identifier(old_name)
  }

  private on_success?: DoStep

  /**
   * Adds a step that will get executed if all previous steps succeed. The real
   * step added to this Job will always be a DoStep, with the passed step added
   * onto it as the last Step.
   *
   * https://concourse-ci.org/jobs.html#schema.job.on_success
   *
   * @param {AnyStep} step The Step to execute when this job succeeds.
   * @returns {void}
   */
  public add_on_success = (step: AnyStep) => {
    if (!this.on_success && step instanceof DoStep) {
      this.on_success = step
      return
    }

    if (!this.on_success)
      this.on_success = new DoStep(`${this.name}_on_success`)

    this.on_success.add_do(step)
  }

  private on_failure?: DoStep

  /**
   * Adds a step that will get executed if any previous step fails. Failure
   * indicates a non-normal exit state, such as the worker crashing, or losing
   * connection.
   *
   * The real step added to this Job will always be a DoStep, with the passed
   * step added onto it as the last Step.
   *
   * https://concourse-ci.org/jobs.html#schema.job.on_failure
   *
   * @param {AnyStep} step The Step to execute when this job fails.
   * @returns {void}
   */
  public add_on_failure = (step: AnyStep) => {
    if (!this.on_failure && step instanceof DoStep) {
      this.on_failure = step
      return
    }

    if (!this.on_failure)
      this.on_failure = new DoStep(`${this.name}_on_failure`)

    this.on_failure.add_do(step)
  }

  private on_error?: DoStep

  /**
   * Adds a step that will get executed if any previous step fails. Error
   * indicates a normal exit state, such as tests failing, or compilers
   * crashing.
   *
   * The real step added to this Job will always be a DoStep, with the passed
   * step added onto it as the last Step.
   *
   * https://concourse-ci.org/jobs.html#schema.job.on_error
   *
   * @param {AnyStep} step The Step to execute when this job errors.
   * @returns {void}
   */
  public add_on_error = (step: AnyStep) => {
    if (!this.on_error && step instanceof DoStep) {
      this.on_error = step
      return
    }

    if (!this.on_error) this.on_error = new DoStep(`${this.name}_on_error`)

    this.on_error.add_do(step)
  }

  private on_abort?: DoStep

  /**
   * Adds a step that will get executed if the job is aborted. Abort
   * indicates that a user has manually cancelled the job (including API
   * clients).
   *
   * The real step added to this Job will always be a DoStep, with the passed
   * step added onto it as the last Step.
   *
   * https://concourse-ci.org/jobs.html#schema.job.on_abort
   *
   * @param {AnyStep} step The Step to execute when this job is aborted.
   * @returns {void}
   */
  public add_on_abort = (step: AnyStep) => {
    if (!this.on_abort && step instanceof DoStep) {
      this.on_abort = step
      return
    }

    if (!this.on_abort) this.on_abort = new DoStep(`${this.name}_on_abort`)

    this.on_abort.add_do(step)
  }

  private ensure?: DoStep

  /**
   * Adds a step that will get executed all of the time, regardless of the
   * exit status of previous steps. Useful for cleaning up state for example.
   *
   * The real step added to this Job will always be a DoStep, with the passed
   * step added onto it as the last Step.
   *
   * https://concourse-ci.org/jobs.html#schema.job.ensure
   *
   * @param {AnyStep} step The Step to execute when this job finishes.
   * @returns {void}
   */
  public add_ensure = (step: AnyStep) => {
    if (!this.ensure && step instanceof DoStep) {
      this.ensure = step
      return
    }

    if (!this.ensure) this.ensure = new DoStep(`${this.name}_ensure`)

    this.ensure.add_do(step)
  }

  /**
   * https://concourse-ci.org/jobs.html#schema.job.public
   */
  public public: boolean

  /**
   * https://concourse-ci.org/jobs.html#schema.job.serial
   */
  public serial: boolean

  private serial_groups?: Identifier

  /**
   * https://concourse-ci.org/jobs.html#schema.job.serial_groups
   *
   * @param {string} serial_groups
   */
  public set_serial_groups = (serial_groups: string) => {
    this.serial_groups = get_identifier(serial_groups)
  }

  private get_base_resources(): Resource[] {
    const result: Resource[] = []

    if (this.on_success) {
      result.push(...this.on_success.get_resources())
    }

    if (this.on_failure) {
      result.push(...this.on_failure.get_resources())
    }

    if (this.on_error) {
      result.push(...this.on_error.get_resources())
    }

    if (this.on_abort) {
      result.push(...this.on_abort.get_resources())
    }

    if (this.ensure) {
      result.push(...this.ensure.get_resources())
    }

    return result
  }

  /**
   * @internal Used by the compiler to get all resources
   *
   * @returns {Resource[]} All resources used by this job
   */
  public get_resources = (): Resource[] => {
    const result = this.get_base_resources()

    this.plan.forEach((step) => {
      // Get and Put steps hold resources, so we extract those here.
      result.push(...step.get_resources())
    })

    return result
  }

  /**
   * @internal Used by the compiler to get all task steps
   *
   * @returns {TaskStep[]} All the task steps in this job
   */
  public get_task_steps = () => {
    const result: TaskStep[] = []

    this.plan?.forEach((step) => {
      if (step instanceof TaskStep) {
        result.push(step)
      }
    })

    return result
  }

  /**
   * Serialises this Job into a valid Concourse configuration fixture
   *
   * @returns {Type.Job} A JSON representation of this Job
   */
  public serialise() {
    const result: Type.Job = {
      name: this.name,
      plan: this.plan.map((s) => s.serialise()),
      build_log_retention: this.build_log_retention,

      // Deprecated, same as build_log_retention.builds
      build_logs_to_retain: undefined,
      disable_manual_trigger: this.disable_manual_trigger,
      ensure: this.ensure?.serialise(),
      interruptible: this.interruptible,
      max_in_flight: this.max_in_flight,
      old_name: this.old_name,
      on_abort: this.on_abort?.serialise(),
      on_error: this.on_error?.serialise(),
      on_failure: this.on_failure?.serialise(),
      on_success: this.on_success?.serialise(),
      public: this.public,
      serial: this.serial,
      serial_groups: this.serial_groups,
    }

    return result
  }

  /**
   * @internal Used by the decompiler to construct a new Job from its JSON
   * representation
   *
   * @param {Type.Job} input Valid JSON representation of a Job
   * @param {Resource[]} resource_pool A list of resources available in the
   * parent pipeline
   * @returns
   */
  public static deserialise(input: Type.Job, resource_pool: Resource[]) {
    return new Job(input.name, (job) => {
      job.plan = input.plan.map((step, index) =>
        Step.deserialise_any(`${input.name}_step_${index}`, resource_pool, step)
      )

      job.build_log_retention = input.build_log_retention

      // Upgrade deprecated config to non-deprecated format
      if (input.build_logs_to_retain && !job.build_log_retention.builds) {
        job.build_log_retention = {
          ...job.build_log_retention,
          builds: input.build_logs_to_retain,
        }
      }

      if (input.ensure) {
        job.ensure = Step.deserialise_prefer_do(
          `${job.name}_ensure`,
          resource_pool,
          input.ensure
        )
      }

      job.interruptible = input.interruptible
      job.max_in_flight = input.max_in_flight
      job.old_name = input.old_name

      if (input.on_abort) {
        job.on_abort = Step.deserialise_prefer_do(
          `${job.name}_on_abort`,
          resource_pool,
          input.on_abort
        )
      }

      if (input.on_error) {
        job.on_error = Step.deserialise_prefer_do(
          `${job.name}_on_error`,
          resource_pool,
          input.on_error
        )
      }

      if (input.on_failure) {
        job.on_failure = Step.deserialise_prefer_do(
          `${job.name}_on_failure`,
          resource_pool,
          input.on_failure
        )
      }

      if (input.on_success) {
        job.on_success = Step.deserialise_prefer_do(
          `${job.name}_on_success`,
          resource_pool,
          input.on_success
        )
      }

      job.public = input.public
      job.serial = input.serial
      job.serial_groups = input.serial_groups
    })
  }
}
