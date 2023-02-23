import {VError} from 'verror'

import {Initer} from '../../declarations/initialisable'
import * as Type from '../../declarations/types'
import {Resource} from '../resource'

import {Task} from '../task'

import {Step} from './_base'

export class TaskStep<
  Input extends Type.Identifier = Type.Identifier,
  Output extends Type.Identifier = Type.Identifier
> extends Step<Type.TaskStep> {
  private static customiser: Initer<TaskStep>

  public static customise = (init: Initer<TaskStep>) => {
    TaskStep.customiser = init
  }

  constructor(
    public override name: string,
    init?: Initer<TaskStep<Input, Output>>
  ) {
    super(name)

    if (TaskStep.customiser) {
      TaskStep.customiser(this)
    }

    if (init) {
      init(this)
    }
  }

  private task?: Task<Input, Output>

  public set_task = (task: Task<Input, Output>) => {
    this.task = task
  }

  public get_task = () => {
    return this.task
  }

  private file?: string

  public set_file = (file: string) => {
    this.file = file
  }

  public image?: Type.Identifier

  public privileged: boolean

  private vars: Type.Vars

  public set_var = (...vars: Type.Param[]) => {
    if (!this.vars) this.vars = {}

    vars.forEach((variable) => {
      this.vars[variable.key] = variable.value
    })
  }

  private params: Type.EnvVars

  public set_param = (...params: Type.EnvVar[]) => {
    if (!this.params) this.params = {}

    params.forEach((param) => {
      this.params[param.key] = param.value
    })
  }

  private input_mapping?: Record<Input, Type.Identifier>

  public set_input_mapping = (input: Input, mapped_input: Type.Identifier) => {
    if (!this.input_mapping)
      this.input_mapping = {} as Record<Input, Type.Identifier>

    this.input_mapping[input] = mapped_input
  }

  private output_mapping?: Record<Output, Type.Identifier>

  public set_output_mapping = (
    output: Output,
    mapped_output: Type.Identifier
  ) => {
    if (!this.output_mapping)
      this.output_mapping = {} as Record<Output, Type.Identifier>

    this.output_mapping[output] = mapped_output
  }

  public get_resources(): Resource[] {
    return this.get_base_resources()
  }

  public serialise() {
    if (!this.task && !this.file) {
      throw new VError(
        'Cannot serialise TaskStep because it has no task. Either set "task" or "file"'
      )
    }

    const result: Type.TaskStep = {
      ...this.serialise_base(),
      task: this.task?.name ?? this.file,
      config: this.file ? undefined : this.task?.serialise(),
      file: this.file,
      image: this.image,
      privileged: this.privileged,
      vars: this.vars,
      params: this.params,
      input_mapping: this.input_mapping,
      output_mapping: this.output_mapping,
    }

    return result
  }

  public static deserialise(
    name: string,
    resourcePool: Resource[],
    input: Type.TaskStep
  ) {
    return new TaskStep(name, (step) => {
      this.deserialise_base(step, resourcePool, input)

      // TODO: Deserialise tasks
      // step.task = input.task

      step.file = input.file
      step.image = input.image
      step.privileged = input.privileged
      step.vars = input.vars
      step.params = input.params
      step.input_mapping = input.input_mapping
      step.output_mapping = input.output_mapping
    })
  }
}
