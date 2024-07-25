import { Customiser } from '../../declarations/customiser.js'
import { get_identifier, Identifier } from '../../utils/identifier/index.js'
import * as Type from '../../declarations/types.js'
import { Resource } from '../resource.js'

import { Task } from '../task.js'

import { Step } from './base.js'

export class TaskStep<
  Input extends Identifier = Identifier,
  Output extends Identifier = Identifier,
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

  public image?: string

  public privileged: boolean

  private vars: Type.Vars

  public set_vars = (vars: Type.Vars) => {
    if (!this.vars) this.vars = {}

    this.vars = {
      ...this.vars,
      ...vars,
    }
  }

  private params: Type.EnvVars

  public set_params = (params: Type.EnvVars) => {
    if (!this.params) this.params = {}

    this.params = {
      ...this.params,
      ...params,
    }
  }

  private input_mapping?: Record<string, string>

  public set_input_mapping = (input: string, mapped_input: string) => {
    if (!this.input_mapping) this.input_mapping = {}

    this.input_mapping[input] = mapped_input
  }

  private output_mapping?: Record<string, string>

  public set_output_mapping = (output: string, mapped_output: string) => {
    if (!this.output_mapping) this.output_mapping = {}

    this.output_mapping[output] = mapped_output
  }

  /**
   * @internal Used by the compiler
   */
  public get_task_steps() {
    const result = this.get_base_task_steps()

    result.push(this)

    return result
  }

  /**
   * @internal Used by the compiler
   */
  public get_resources(): Resource[] {
    return this.get_base_resources()
  }

  public serialise() {
    let input_mapping: Record<Input, string>

    if (this.input_mapping) {
      input_mapping = {} as Record<Input, string>

      Object.entries(this.input_mapping).forEach(([input, mapped_input]) => {
        input_mapping[get_identifier(input)] = mapped_input
      })
    }

    let output_mapping: Record<Output, string>

    if (this.output_mapping) {
      output_mapping = {} as Record<Output, string>

      Object.entries(this.output_mapping).forEach(([output, mapped_output]) => {
        output_mapping[get_identifier(output)] = mapped_output
      })
    }

    const result: Type.TaskStep = {
      ...this.serialise_base(),
      task: this.task?.name
        ? get_identifier(this.task.name)
        : get_identifier(`${this.name}_task`),
      config: this.file ? undefined : this.task?.serialise(),
      file: this.file,
      image: get_identifier(this.image),
      privileged: this.privileged,
      vars: this.vars,
      params: this.params,
      input_mapping,
      output_mapping,
    }

    return result
  }
}
