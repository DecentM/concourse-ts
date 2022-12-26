import {VError} from 'verror'

import {Initer} from '~/declarations/initialisable'
import {Serialisable} from '~/declarations/serialisable'
import * as Type from '~/declarations/types'

import {RunNotImplementedCommand} from '~/defaults/commands/run-not-implemented'
import {PlatformLinux} from '~/defaults/platforms'

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

  public add_cache = (input: Type.TaskCache) => {
    if (!this.caches) this.caches = []

    this.caches.push(input)
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

  public add_input = (input: Type.TaskInput) => {
    if (!this.inputs) this.inputs = []

    this.inputs.push(input)
  }

  private outputs: Type.TaskOutput[]

  public add_output = (input: Type.TaskOutput) => {
    if (!this.outputs) this.outputs = []

    this.outputs.push(input)
  }

  private params: Type.EnvVars

  public set_params = (input: Type.EnvVars) => {
    if (!this.params) this.params = {}

    this.params = input
  }

  public set_param = (name: string, value: string) => {
    this.params[name] = value
  }

  public rootfs_uri: string | undefined

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
