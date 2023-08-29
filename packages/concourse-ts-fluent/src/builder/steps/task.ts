import * as ConcourseTs from '@decentm/concourse-ts'

import { StepBuilderBase } from './base'
import { TaskBuilder } from '../task'

export class TaskStepBuilder extends StepBuilderBase<ConcourseTs.TaskStep> {
  public override build(): ConcourseTs.TaskStep<
    ConcourseTs.Utils.Identifier,
    ConcourseTs.Utils.Identifier
  > {
    const step = new ConcourseTs.TaskStep(this._name)

    if (this._customise) {
      const task_builder = new TaskBuilder()
      this._customise(task_builder)

      step.set_task(task_builder.build())
    }

    if (this._file) step.set_file(this._file)
    if (this._image) step.image = this._image
    if (this._privileged) step.privileged = this._privileged
    if (this._vars) step.set_vars(this._vars)
    if (this._params) step.set_params(this._params)
    if (this._input_mapping) step.set_input_mapping(...this._input_mapping)
    if (this._output_mapping) step.set_output_mapping(...this._output_mapping)

    return step
  }

  private _customise: ConcourseTs.Type.Customiser<TaskBuilder>

  public task<
    Input extends ConcourseTs.Utils.Identifier = ConcourseTs.Utils.Identifier,
    Output extends ConcourseTs.Utils.Identifier = ConcourseTs.Utils.Identifier,
  >(
    customise: ConcourseTs.Type.Customiser<TaskBuilder<Input, Output>>
  ): TaskStepBuilder {
    this._customise = customise

    return this
  }

  private _file: string

  public file(file: string): TaskStepBuilder {
    this._file = file

    return this
  }

  private _image: string

  public image(image: string): TaskStepBuilder {
    this._image = image

    return this
  }

  private _privileged: boolean

  public privileged(): TaskStepBuilder {
    this._privileged = true

    return this
  }

  private _vars: ConcourseTs.Type.Vars

  public vars(vars: ConcourseTs.Type.Vars) {
    this._vars = vars

    return this
  }

  private _params: ConcourseTs.Type.EnvVars

  public params(params: ConcourseTs.Type.EnvVars) {
    this._params = params

    return this
  }

  private _input_mapping: [string, string]

  public input_mapping(input: string, mapped_input: string) {
    this._input_mapping = [input, mapped_input]

    return this
  }

  private _output_mapping: [string, string]

  public output_mapping(output: string, mapped_output: string) {
    this._output_mapping = [output, mapped_output]

    return this
  }
}
