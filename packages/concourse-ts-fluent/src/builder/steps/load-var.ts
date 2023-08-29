import * as ConcourseTs from '@decentm/concourse-ts'

import { StepBuilderBase } from './base'

export class LoadVarStepBuilder extends StepBuilderBase<ConcourseTs.LoadVarStep> {
  public override build(): ConcourseTs.LoadVarStep {
    const step = new ConcourseTs.LoadVarStep(this._name)

    if (this._load_var) step.load_var = this._load_var
    if (this._file) step.file = this._file
    if (this._format) step.format = this._format
    if (this._reveal) step.reveal = this._reveal

    return step
  }

  private _load_var: string

  public load_var(load_var: string): LoadVarStepBuilder {
    this._load_var = load_var

    return this
  }

  private _file: ConcourseTs.Type.FilePath

  public file(path: ConcourseTs.Type.FilePath): LoadVarStepBuilder {
    this._file = path

    return this
  }

  private _format: ConcourseTs.Type.LoadVarStep['format']

  public format(format: ConcourseTs.Type.LoadVarStep['format']): LoadVarStepBuilder {
    this._format = format

    return this
  }

  private _reveal: boolean

  public reveal(): LoadVarStepBuilder {
    this._reveal = true

    return this
  }
}
