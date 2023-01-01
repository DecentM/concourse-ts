import {VError} from 'verror'

import {Initer} from '../declarations/initialisable'
import {Serialisable} from '../declarations/serialisable'
import * as Type from '../declarations/types'

import {RunNotImplementedCommand} from '../defaults/commands/run-not-implemented'
import {PlatformLinux} from '../defaults/platforms'

export class Task extends Serialisable<Type.Task> {
  constructor(public name: string, init?: Initer<Task>) {
    super()

    if (init) {
      init(this)
    }
  }

  private image_resource: Type.AnonymousResource

  public set_image_resource = (input: Type.AnonymousResource) => {
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

  private inputs: Type.TaskInput[]

  public add_input = (...inputs: Type.TaskInput[]) => {
    if (!this.inputs) this.inputs = []

    this.inputs.push(...inputs)
  }

  private outputs: Type.TaskOutput[]

  public add_output = (...outputs: Type.TaskOutput[]) => {
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

  public serialise() {
    const result: Type.Task = {
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
