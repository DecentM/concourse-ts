import * as ConcourseTs from '../../../../src'

export class Pipeline<
  Group extends string = string
> extends ConcourseTs.Pipeline<Group> {
  constructor(name: string, init?: ConcourseTs.Initer<Pipeline<Group>>) {
    super(name, init)

    this.set_background_image_url('https://picsum.photos/1920/1080.jpg')
  }
}

export * as Resource from './resources'

export class Job extends ConcourseTs.Job {
  constructor(name: string, init?: ConcourseTs.Initer<Job>) {
    super(name, init)

    this.build_log_retention = {
      builds: 5,
      minimum_succeeded_builds: 3,
    }
  }
}

export class Task extends ConcourseTs.Task {
  constructor(name: string, init?: ConcourseTs.Initer<Task>) {
    super(name, init)

    this.set_cpu_limit_percent(50)
    this.set_memory_limit({mb: 10})
  }
}

export class Command extends ConcourseTs.Command {}

export class ShellScript extends ConcourseTs.Presets.Command.ShellScript {}
