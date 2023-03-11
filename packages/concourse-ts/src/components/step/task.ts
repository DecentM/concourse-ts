import {Customiser} from '../../declarations/customiser'
import {get_identifier, Identifier} from '../../utils/identifier'
import * as Type from '../../declarations/types'
import {Resource} from '../resource'

import {Task} from '../task'

import {Step} from './base'

export class TaskStep<
  Input extends Identifier = Identifier,
  Output extends Identifier = Identifier
> extends Step<Type.TaskStep> {
  private static customiser: Customiser<TaskStep>

  public static customise = (init: Customiser<TaskStep>) => {
    TaskStep.customiser = init
  }

  constructor(
    public override name: string,
    customise?: Customiser<TaskStep<Input, Output>>
  ) {
    super(name)

    if (TaskStep.customiser) {
      TaskStep.customiser(this)
    }

    if (customise) {
      customise(this)
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

  public image?: Identifier

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

  private input_mapping?: Record<Input, Identifier>

  public set_input_mapping = (input: Input, mapped_input: Identifier) => {
    if (!this.input_mapping)
      this.input_mapping = {} as Record<Input, Identifier>

    this.input_mapping[input] = mapped_input
  }

  private output_mapping?: Record<Output, Identifier>

  public set_output_mapping = (output: Output, mapped_output: Identifier) => {
    if (!this.output_mapping)
      this.output_mapping = {} as Record<Output, Identifier>

    this.output_mapping[output] = mapped_output
  }

  /**
   * @internal Used by the compiler
   *
   * @returns {TaskStep[]}
   */
  public get_task_steps() {
    const result = this.get_base_task_steps()

    result.push(this)

    return result
  }

  public get_resources(): Resource[] {
    return this.get_base_resources()
  }

  public serialise() {
    const result: Type.TaskStep = {
      ...this.serialise_base(),
      task: this.task?.name
        ? get_identifier(this.task.name)
        : get_identifier(`${this.name}_task`),
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
}
