import * as ConcourseTs from '@decentm/concourse-ts'

import { CommandBuilder } from './command.js'

export class TaskBuilder<
  Input extends ConcourseTs.Utils.Identifier = ConcourseTs.Utils.Identifier,
  Output extends ConcourseTs.Utils.Identifier = ConcourseTs.Utils.Identifier,
> {
  private task: ConcourseTs.Task<Input, Output>

  public build(): ConcourseTs.Task<Input, Output> {
    return this.task
  }

  constructor() {
    this.task = new ConcourseTs.Task<Input, Output>(null)
  }

  public name(name: string): TaskBuilder<Input, Output> {
    this.task.name = name

    return this
  }

  public image_resource(
    input: ConcourseTs.Resource | ConcourseTs.Type.AnonymousResource<string>
  ): TaskBuilder<Input, Output> {
    this.task.set_image_resource(input)

    return this
  }

  public platform(platform: ConcourseTs.Type.Platform): TaskBuilder<Input, Output> {
    this.task.platform = platform

    return this
  }

  public run(
    customise: ConcourseTs.Type.Customiser<CommandBuilder>
  ): TaskBuilder<Input, Output> {
    const command_builder = new CommandBuilder()
    customise(command_builder)

    this.task.run = command_builder.build()

    return this
  }

  public cache(cache: ConcourseTs.Type.TaskCache): TaskBuilder<Input, Output> {
    this.task.add_cache(cache)

    return this
  }

  public cpu_limit_shares(input: number): TaskBuilder<Input, Output> {
    this.task.set_cpu_limit_shares(input)

    return this
  }

  public memory_limit(
    input: ConcourseTs.Utils.BytesInput
  ): TaskBuilder<Input, Output> {
    this.task.set_memory_limit(input)

    return this
  }

  public input(
    input: ConcourseTs.Type.TaskInput<string>
  ): TaskBuilder<Input, Output> {
    this.task.add_input(input)

    return this
  }

  public output(
    output: ConcourseTs.Type.TaskOutput<string>
  ): TaskBuilder<Input, Output> {
    this.task.add_output(output)

    return this
  }

  public params(params: ConcourseTs.Type.EnvVars): TaskBuilder<Input, Output> {
    this.task.set_params(params)

    return this
  }

  public rootfs_uri(rootfs_uri: string): TaskBuilder<Input, Output> {
    this.task.rootfs_uri = rootfs_uri

    return this
  }
}
