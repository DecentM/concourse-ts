import {VError} from 'verror'
import {Initer} from '~/declarations/initialisable'

import * as Type from '~/declarations/types'

import {Task} from '../task'

import {Step} from './_base'

export class TaskStep extends Step<Type.TaskStep> {
  constructor(init?: Initer<TaskStep>) {
    super()

    if (init) {
      init(this)
    }
  }

  private task?: Task

  public set_task = (task: Task) => {
    this.task = task
  }

  private task_path?: string

  public set_task_path = (path: string) => {
    this.task_path = path
  }

  public image?: Type.Identifier

  public privileged = false

  private vars: Type.Vars

  public set_var = (key: string, value: string) => {
    if (!this.vars) this.vars = {}

    this.vars[key] = value
  }

  private params: Type.EnvVars

  public set_param = (key: string, value: string) => {
    if (!this.params) this.params = {}

    this.params[key] = value
  }

  private input_mapping?: Record<Type.TaskInput['name'], Type.Identifier>

  public set_input_mapping = (
    input: Type.Identifier,
    mapped_input: Type.Identifier
  ) => {
    if (!this.input_mapping) this.input_mapping = {}

    this.input_mapping[input] = mapped_input
  }

  private output_mapping?: Record<Type.TaskOutput['name'], Type.Identifier>

  public set_output_mapping = (
    output: Type.Identifier,
    mapped_output: Type.Identifier
  ) => {
    if (!this.output_mapping) this.output_mapping = {}

    this.output_mapping[output] = mapped_output
  }

  public serialise() {
    if (!this.task && !this.task_path) {
      throw new VError(
        'Cannot serialise TaskStep because it has no task. Either set "task" or "task_path"'
      )
    }

    const result: Type.TaskStep = {
      ...this.serialise_base(),
      task: this.task?.name ?? this.task_path,
      config: this.task?.serialise() ?? undefined,
      file: this.task_path,
      image: this.image,
      privileged: this.privileged,
      vars: this.vars,
      params: this.params,
      input_mapping: this.input_mapping,
      output_mapping: this.output_mapping,
    }

    return result
  }
}
