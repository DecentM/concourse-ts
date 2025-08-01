import { Customiser } from '../../declarations/customiser.js'
import { get_identifier } from '../../utils/identifier/index.js'
import * as Type from '../../declarations/types.js'
import { Resource } from '../resource.js'

import { Step } from './base.js'
import { Pipeline } from '../pipeline.js'

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

  private pipeline: Pipeline | string

  public set_pipeline = (pipeline: Pipeline | string) => {
    this.pipeline = pipeline
  }

  private file?: Type.FilePath

  public set_file = (file: Type.FilePath) => {
    this.file = file
  }

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

  private team?: string

  public set_team = (team: string) => {
    this.team = team
  }

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
        typeof this.pipeline === 'string'
          ? get_identifier(this.pipeline)
          : get_identifier(this.pipeline?.name),
      file: this.file,
      instance_vars: this.instance_vars,
      vars: this.vars,
      var_files: this.var_files,
      team: get_identifier(this.team),
    }

    return result
  }
}
