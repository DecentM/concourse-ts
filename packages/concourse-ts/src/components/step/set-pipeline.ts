import {Customiser} from '../../declarations/customiser'
import {get_identifier} from '../../utils/identifier'
import * as Type from '../../declarations/types'
import {Resource} from '../resource'

import {Step} from './base'
import {Pipeline} from '../pipeline'

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

  public set_pipeline: Pipeline | string

  public file?: Type.FilePath

  private instance_vars: Type.Vars

  public set_instance_vars = (vars: Type.Vars) => {
    if (!this.instance_vars) this.instance_vars = {}

    this.instance_vars = {
      ...this.instance_vars,
      ...vars,
    }
  }

  private vars: Type.Vars

  public set_vars = (vars: Type.Vars) => {
    if (!this.vars) this.vars = {}

    this.vars = {
      ...this.vars,
      ...vars,
    }
  }

  private var_files: Type.FilePath[]

  public add_var_file = (...paths: Type.FilePath[]) => {
    if (!this.var_files) this.var_files = []

    this.var_files.push(...paths)
  }

  public team?: string

  /**
   * @internal Used by the compiler
   */
  public get_task_steps() {
    return this.get_base_task_steps()
  }

  /**
   * @internal Used by the compiler
   */
  public get_resources(): Resource[] {
    return this.get_base_resources()
  }

  public serialise() {
    const result: Type.SetPipelineStep = {
      ...this.serialise_base(),
      set_pipeline:
        typeof this.set_pipeline === 'string'
          ? get_identifier(this.set_pipeline)
          : get_identifier(this.set_pipeline?.name),
      file: this.file,
      instance_vars: this.instance_vars,
      vars: this.vars,
      var_files: this.var_files,
      team: get_identifier(this.team),
    }

    return result
  }
}
