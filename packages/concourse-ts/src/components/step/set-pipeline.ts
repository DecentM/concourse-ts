import {VError} from 'verror'

import {Customiser} from '../../declarations/customiser'
import {Identifier} from '../../utils/identifier'
import * as Type from '../../declarations/types'
import {Resource} from '../resource'

import {Step} from './base'

export class SetPipelineStep extends Step<Type.SetPipelineStep> {
  private static customiser: Customiser<SetPipelineStep>

  public static customise = (init: Customiser<SetPipelineStep>) => {
    SetPipelineStep.customiser = init
  }

  constructor(
    public override name: string,
    customise?: Customiser<SetPipelineStep>
  ) {
    super(name)

    if (SetPipelineStep.customiser) {
      SetPipelineStep.customiser(this)
    }

    if (customise) {
      customise(this)
    }
  }

  public set_pipeline: Identifier | 'self'

  public file?: Type.FilePath

  private instance_vars: Type.Vars

  public set_instance_var = (...vars: Type.Param[]) => {
    if (!this.instance_vars) this.instance_vars = {}

    vars.forEach((variable) => {
      this.instance_vars[variable.key] = variable.value
    })
  }

  private vars: Type.Vars

  public set_var = (...vars: Type.Param[]) => {
    if (!this.vars) this.vars = {}

    vars.forEach((variable) => {
      this.vars[variable.key] = variable.value
    })
  }

  private var_files: Type.FilePath[]

  public add_var_file = (...paths: Type.FilePath[]) => {
    if (!this.var_files) this.var_files = []

    this.var_files.push(...paths)
  }

  public team?: Identifier

  /**
   * @internal Used by the compiler
   *
   * @returns {TaskStep[]}
   */
  public get_task_steps() {
    return this.get_base_task_steps()
  }

  public get_resources(): Resource[] {
    return this.get_base_resources()
  }

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
