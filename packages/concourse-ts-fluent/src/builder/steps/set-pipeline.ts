import * as ConcourseTs from '@decentm/concourse-ts'

import { StepBuilderBase } from './base'

export class SetPipelineStepBuilder extends StepBuilderBase<ConcourseTs.SetPipelineStep> {
  public override build(): ConcourseTs.SetPipelineStep {
    const step = new ConcourseTs.SetPipelineStep(this._name)

    if (this._pipeline) step.set_pipeline = this._pipeline
    if (this._file) step.file = this._file
    if (Object.keys(this._vars).length) step.set_vars(this._vars)
    if (this._var_file.length) step.add_var_file(...this._var_file)

    if (Object.keys(this._instance_vars).length)
      step.set_instance_vars(this._instance_vars)

    return step
  }

  private _pipeline: string

  public pipeline(name: string): SetPipelineStepBuilder {
    this._pipeline = name

    return this
  }

  private _file: ConcourseTs.Type.FilePath

  public file(path: ConcourseTs.Type.FilePath): SetPipelineStepBuilder {
    this._file = path

    return this
  }

  private _instance_vars: ConcourseTs.Type.Vars = {}

  public instance_vars(vars: ConcourseTs.Type.Vars): SetPipelineStepBuilder {
    this._instance_vars = vars

    return this
  }

  private _vars: ConcourseTs.Type.Vars = {}

  public vars(vars: ConcourseTs.Type.Vars): SetPipelineStepBuilder {
    this._vars = { ...this._vars, ...vars }

    return this
  }

  private _var_file: ConcourseTs.Type.FilePath[] = []

  public var_file(...paths: ConcourseTs.Type.FilePath[]): SetPipelineStepBuilder {
    this._var_file.push(...paths)

    return this
  }
}
