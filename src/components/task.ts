import {Serialisable} from '~/declarations/serialisable'
import * as Type from '~/declarations/types'

import {RunNotImplementedCommand} from '~/defaults/commands/run-not-implemented'
import {PlatformLinux} from '~/defaults/platforms/linux'

export class Task extends Serialisable<Type.Task> {
  constructor() {
    super()
  }

  public image_resource: Type.AnonymousResource

  public platform = PlatformLinux

  public run = RunNotImplementedCommand

  public caches: Type.TaskCache[] = []

  public container_limits: Type.ContainerLimits = {}

  public inputs: Type.TaskInput[] = []

  public outputs: Type.TaskOutput[] = []

  public params: Type.EnvVars = {}

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
