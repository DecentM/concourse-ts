import {VError} from 'verror'

import {Initer} from '../declarations/initialisable'

import * as Type from '../declarations/types'
import * as Commands from '../presets/commands'
import * as Platforms from '../presets/platforms'
import {BytesInput, get_bytes} from '../utils/bytes'

import {Command} from './command'
import {TaskStep} from './step'

export class Task<
  Input extends Type.Identifier = Type.Identifier,
  Output extends Type.Identifier = Type.Identifier
> {
  constructor(public name: string, init?: Initer<Task<Input, Output>>) {
    if (init) {
      init(this)
    }
  }

  private image_resource: Type.AnonymousResource

  public set_image_resource = (input: Type.AnonymousResource) => {
    // TODO: Implement this as a validator instead of throwing here.
    // https://concourse-ci.org/tasks.html#schema.task-config.image_resource

    // This field is only required for tasks targeting the Linux platform.
    // This field will be ignored for Windows and Darwin workers.
    if (this.platform !== Platforms.Linux) {
      throw new VError(
        `Image resources cannot be created for ${this.platform}, only ${Platforms.Linux}`
      )
    }

    this.image_resource = input
  }

  public platform = Platforms.Linux

  public run: Command = new Commands.RunNotImplemented()

  private caches: Type.TaskCache[]

  public add_cache = (...inputs: Type.TaskCache[]) => {
    if (!this.caches) this.caches = []

    this.caches.push(...inputs)
  }

  private container_limits: Type.ContainerLimits

  public set_cpu_limit_percent = (input: number) => {
    if (!this.container_limits) this.container_limits = {}

    this.container_limits.cpu = input
  }

  public set_memory_limit = (input: BytesInput) => {
    this.container_limits.memory = get_bytes(input)
  }

  private inputs: Type.TaskInput<Input>[]

  public add_input = (...inputs: Type.TaskInput<Input>[]) => {
    if (!this.inputs) this.inputs = []

    this.inputs.push(...inputs)
  }

  private outputs: Type.TaskOutput<Output>[]

  public add_output = (...outputs: Type.TaskOutput<Output>[]) => {
    if (!this.outputs) this.outputs = []

    this.outputs.push(...outputs)
  }

  private params: Type.EnvVars

  public set_params = (...params: Type.EnvVar[]) => {
    if (!this.params) this.params = {}

    params.forEach((param) => {
      this.params[param.key] = param.value
    })
  }

  public rootfs_uri?: string

  public as_task_step = (init?: Initer<TaskStep<Input, Output>>) => {
    return new TaskStep<Input, Output>(`${this.name}_step`, (taskStep) => {
      taskStep.set_task(this)

      if (init) {
        init(taskStep)
      }
    })
  }

  public serialise() {
    const result: Type.Task<Input, Output> = {
      image_resource: this.image_resource,
      platform: this.platform,
      run: this.run.serialise(),
      caches: this.caches,
      container_limits: this.container_limits,
      inputs: this.inputs,
      outputs: this.outputs,
      params: this.params,
      rootfs_uri: this.rootfs_uri,
    }

    return result
  }

  public static deserialise(name: string, input: Type.Task<string, string>) {
    return new Task(name, (task) => {
      task.image_resource = input.image_resource
      task.platform = input.platform
      task.run = Command.deserialise(`${name}_run`, input.run)
      task.caches = input.caches
      task.container_limits = input.container_limits
      task.inputs = input.inputs
      task.outputs = input.outputs
      task.params = input.params
      task.rootfs_uri = input.rootfs_uri
    })
  }
}
