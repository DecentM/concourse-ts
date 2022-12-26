import {VError} from 'verror'
import {Initer} from '~/declarations/initialisable'

import * as Type from '~/declarations/types'

import {Step} from './_base'

export class SetPipelineStep extends Step<Type.SetPipelineStep> {
  constructor(public name: string, init?: Initer<SetPipelineStep>) {
    super(name)

    if (init) {
      init(this)
    }
  }

  public set_pipeline: Type.SetPipeline = 'self'

  public file?: Type.FilePath

  private instance_vars: Type.Vars = {}

  public set_instance_var = (key: string, value: string) => {
    this.instance_vars[key] = value
  }

  private vars: Type.Vars

  public set_var = (key: string, value: string) => {
    if (!this.vars) this.vars = {}

    this.vars[key] = value
  }

  private var_files: Type.FilePath[]

  public add_var_file = (path: Type.FilePath) => {
    if (!this.var_files) this.var_files = []

    this.var_files.push(path)
  }

  public team?: Type.Identifier

  public serialise() {
    if (!this.set_pipeline) {
      throw new VError(
        'Cannot serialise SetPipelineStep, because "set_pipeline" has not been set'
      )
    }

    if (!this.file) {
      throw new VError(
        `Cannot serialise SetPipelineStep, because "file" has not been set`
      )
    }

    const result: Type.SetPipelineStep = {
      ...this.serialise_base(),
      set_pipeline: this.set_pipeline,
      file: this.file,
      instance_vars: this.instance_vars,
      vars: this.vars,
      var_files: this.var_files,
      team: this.team,
    }

    return result
  }
}
