import {VError} from 'verror'

import {Initer} from '../declarations/initialisable'
import {Serialisable} from '../declarations/serialisable'
import * as Type from '../declarations/types'

import {RunNotImplementedCommand} from '../defaults/commands/run-not-implemented'
import {PlatformLinux} from '../defaults/platforms'
import {TaskStep} from './step'

export class Task<
  Input extends Type.Identifier = Type.Identifier,
  Output extends Type.Identifier = Type.Identifier
> extends Serialisable<Type.Task<Input, Output>> {
  constructor(public name: string, init?: Initer<Task<Input, Output>>) {
    super()

    if (init) {
      init(this)
    }
  }

  public get filename() {
    return `${this.name}.yml`
  }

  private image_resource: Type.AnonymousResource

  public set_image_resource = (input: Type.AnonymousResource) => {
    // TODO: Implement this as a validator instead of throwing here.
    // https://concourse-ci.org/tasks.html#schema.task-config.image_resource

    // This field is only required for tasks targeting the Linux platform.
    // This field will be ignored for Windows and Darwin workers.
    if (this.platform !== PlatformLinux) {
      throw new VError(
        `Image resources cannot be created for ${this.platform}, only ${PlatformLinux}`
      )
    }

    this.image_resource = input
  }

  public platform = PlatformLinux

  public run = RunNotImplementedCommand

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

  public set_memory_limit_percent = (input: number) => {
    this.container_limits.memory = input
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
      run: this.run,
      caches: this.caches,
      container_limits: this.container_limits,
      inputs: this.inputs,
      outputs: this.outputs,
      params: this.params,
      rootfs_uri: this.rootfs_uri,
    }

    return result
  }
}
