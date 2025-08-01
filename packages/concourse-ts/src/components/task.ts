import { Customiser } from '../declarations/customiser.js'
import { get_identifier, Identifier } from '../utils/identifier/index.js'

import * as Type from '../declarations/types.js'

import { BytesInput, get_bytes } from '../utils/bytes/index.js'

import { Command } from './command.js'
import { Resource } from './resource.js'
import { TaskStep } from './step/index.js'

/**
 * https://concourse-ci.org/tasks.html
 */
export class Task<
  Input extends Identifier = Identifier,
  Output extends Identifier = Identifier,
> {
  private static customiser: Customiser<Task>

  /**
   * Customises every Task created after this function was called. If called
   * multiple times, only the last call will have an effect.
   *
   * @param {Type.Customiser<TaskStep, CustomTask>} customise
   */
  public static customise = (init: Customiser<Task>) => {
    Task.customiser = init
  }

  private static task_step_customiser: Customiser<TaskStep, Task>

  /**
   * Customises every TaskStep created after this function was called. If called
   * multiple times, only the last call will have an effect.
   *
   * @param {Type.Customiser<TaskStep, CustomTask>} customise
   */
  public static customise_task_step = <CustomTask extends Task>(
    init: Customiser<TaskStep, CustomTask>
  ) => {
    Task.task_step_customiser = init
  }

  private task_step_customiser: Customiser<TaskStep, Task>

  /**
   * Customises every TaskStep created from this Task instance. If called
   * multiple times, only the last call will have an effect.
   *
   * @param {Type.Customiser<TaskStep, CustomTask>} customise
   */
  public customise_task_step = <CustomTask extends Task>(
    customise: Customiser<TaskStep, CustomTask>
  ) => {
    this.task_step_customiser = customise
  }

  /**
   * https://concourse-ci.org/tasks.html
   *
   * @param {string} name The name of the task. Only used for error messages,
   * task names are not included in the serialised output
   * @param {Type.Customiser<Task<Input, Output>>} customise
   */
  constructor(
    public name: string,
    customise?: Customiser<Task<Input, Output>>
  ) {
    if (Task.customiser) {
      Task.customiser(this)
    }

    if (customise) {
      customise(this)
    }
  }

  private image_resource: Type.AnonymousResource

  /**
   * Sets the image_resource of this task. If you pass a Resource, this function
   * will create an anonymous resource from it automatically.
   *
   * https://concourse-ci.org/tasks.html#schema.task-config.image_resource
   *
   * @param {Resource | Type.AnonymousResource<string>} input
   */
  public set_image_resource = (input: Resource | Type.AnonymousResource<string>) => {
    if (input instanceof Resource) {
      const serialised = input.serialise()

      this.image_resource = {
        source: serialised.source,
        type: serialised.type,
        version: serialised.version,
      }
    } else {
      this.image_resource = {
        ...input,
        type: get_identifier(input.type),
      }
    }
  }

  private platform: Type.Platform

  /**
   * https://concourse-ci.org/tasks.html#schema.task-config.platform
   */
  public set_platform = (platform: Type.Platform) => {
    this.platform = platform
  }

  private run: Command

  /**
   * https://concourse-ci.org/tasks.html#schema.task-config.run
   *
   * {@link Command}
   */
  public set_run = (run: Command) => {
    this.run = run
  }

  private caches: Type.TaskCache[] = []

  /**
   * https://concourse-ci.org/tasks.html#schema.task-config.caches
   *
   * @param {Type.TaskCache} input
   */
  public add_cache = (...inputs: Type.TaskCache[]) => {
    this.caches.push(...inputs)
  }

  private container_limits: Type.ContainerLimits

  /**
   * https://concourse-ci.org/tasks.html#schema.container_limits.cpu
   *
   * @param {number} input The amount of shares to allocate to this task
   */
  public set_cpu_limit_shares = (input: number) => {
    if (!this.container_limits) this.container_limits = {}

    this.container_limits.cpu = input
  }

  /**
   * https://concourse-ci.org/tasks.html#schema.container_limits.memory
   *
   * @param {BytesInput} input
   */
  public set_memory_limit = (input: BytesInput) => {
    this.container_limits.memory = get_bytes(input)
  }

  private inputs: Type.TaskInput<string>[]

  /**
   * https://concourse-ci.org/tasks.html#schema.task-config.inputs
   *
   * @param {Type.TaskInput<string>} input
   */
  public add_input = (...inputs: Type.TaskInput<string>[]) => {
    if (!this.inputs) this.inputs = []

    this.inputs.push(...inputs)
  }

  private outputs: Type.TaskOutput<string>[]

  /**
   * https://concourse-ci.org/tasks.html#schema.task-config.outputs
   *
   * @param {Type.TaskOutput<string>} output
   */
  public add_output = (...outputs: Type.TaskOutput<string>[]) => {
    if (!this.outputs) this.outputs = []

    this.outputs.push(...outputs)
  }

  private params: Type.EnvVars

  /**
   * Sets params in a key-value format.
   * For example:
   *
   * ```typescript
   * task.set_params(a: 1, b: 2)
   *
   * task.serialise().params
   * //               ^ {a: '1', b: '2'}
   * ```
   *
   * https://concourse-ci.org/tasks.html#schema.task-config.params
   *
   * @param {Type.EnvVars} params
   */
  public set_params = (params: Type.EnvVars) => {
    if (!this.params) this.params = {}

    this.params = {
      ...this.params,
      ...params,
    }
  }

  private rootfs_uri?: string

  /**
   * https://concourse-ci.org/tasks.html#schema.task-config.rootfs_uri
   */
  public set_rootfs_uri = (rootfs_uri: string) => {
    this.rootfs_uri = rootfs_uri
  }

  /**
   * Creates a TaskStep that already has this Task configured.
   *
   * @param {Type.Customiser<TaskStep>} customise Customises the created TaskStep
   * @returns {TaskStep}
   */
  public as_task_step = (customise?: Customiser<TaskStep<Input, Output>>) => {
    return new TaskStep<Input, Output>(`${this.name}_step`, (step) => {
      if (Task.task_step_customiser) {
        Task.task_step_customiser(step, this)
      }

      if (this.task_step_customiser) {
        this.task_step_customiser(step, this)
      }

      step.set_task(this)

      if (customise) {
        customise(step)
      }
    })
  }

  /**
   * Serialises this Task into a valid Concourse configuration fixture
   *
   * @returns {Type.Task}
   */
  public serialise() {
    const result: Type.Task<Input, Output> = {
      image_resource: this.image_resource,
      platform: this.platform,
      run: this.run?.serialise(),
      caches: this.caches.length === 0 ? undefined : this.caches,
      container_limits: this.container_limits,
      inputs: this.inputs?.map((input) => ({
        ...input,
        name: get_identifier(input.name),
      })),
      outputs: this.outputs?.map((output) => ({
        ...output,
        name: get_identifier(output.name),
      })),
      params: this.params,
      rootfs_uri: this.rootfs_uri,
    }

    return result
  }
}
