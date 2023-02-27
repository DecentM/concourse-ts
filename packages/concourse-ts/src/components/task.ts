import {Initer} from '../declarations/initialisable'

import * as Type from '../declarations/types'
import * as Commands from '../presets/commands'
import * as Platforms from '../presets/platforms'

import {BytesInput, get_bytes} from '../utils/bytes'

import {Command} from './command'
import {Resource} from './resource'
import {TaskStep} from './step'

export class Task<
  Input extends Type.Identifier = Type.Identifier,
  Output extends Type.Identifier = Type.Identifier
> {
  private static customiser: Initer<Task>

  public static customise = (init: Initer<Task>) => {
    Task.customiser = init
  }

  private static task_step_customiser: Initer<TaskStep, Task>

  public static customise_task_step = <CustomTask extends Task>(
    init: Initer<TaskStep, CustomTask>
  ) => {
    Task.task_step_customiser = init
  }

  private task_step_customiser: Initer<TaskStep, Task>

  public customise_task_step = <CustomTask extends Task>(
    init: Initer<TaskStep, CustomTask>
  ) => {
    Task.task_step_customiser = init
  }

  constructor(public name: string, init?: Initer<Task<Input, Output>>) {
    if (Task.customiser) {
      Task.customiser(this)
    }

    if (init) {
      init(this)
    }
  }

  private image_resource: Type.AnonymousResource

  public set_image_resource = (input: Resource | Type.AnonymousResource) => {
    if (input instanceof Resource) {
      this.image_resource = {
        source: input.source,
        type: input.get_resource_type()?.name,
      }
    } else {
      this.image_resource = input
    }
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
    return new TaskStep<Input, Output>(`${this.name}_step`, (step) => {
      if (Task.task_step_customiser) {
        Task.task_step_customiser(step, this)
      }

      if (this.task_step_customiser) {
        this.task_step_customiser(step, this)
      }

      step.set_task(this)

      if (init) {
        init(step)
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
