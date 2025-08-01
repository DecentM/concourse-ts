import { Customiser } from '../../declarations/customiser.js'
import * as Type from '../../declarations/types.js'

import { get_identifier } from '../../utils/identifier/index.js'
import { get_var } from '../../utils/var/index.js'

import { Resource } from '../resource.js'

import { Step } from './base.js'

export class LoadVarStep extends Step<Type.LoadVarStep> {
  private static customiser: Customiser<LoadVarStep>

  public static customise = (init: Customiser<LoadVarStep>) => {
    LoadVarStep.customiser = init
  }

  constructor(
    public override name: string,
    customise?: Customiser<LoadVarStep>
  ) {
    super(name)

    if (LoadVarStep.customiser) {
      LoadVarStep.customiser(this)
    }

    if (customise) {
      customise(this)
    }
  }

  private load_var?: string

  public set_load_var = (load_var: string) => {
    this.load_var = load_var
  }

  private file?: Type.FilePath

  public set_file = (file: Type.FilePath) => {
    this.file = file
  }

  private format?: Type.LoadVarStep['format']

  public set_format = (format: Type.LoadVarStep['format']) => {
    this.format = format
  }

  private reveal: boolean

  /**
   * Sets "reveal" to true - avoid calling to keep false
   *
   * https://concourse-ci.org/load-var-step.html#schema.load-var.reveal
   */
  public set_reveal = () => {
    this.reveal = true
  }

  public get var() {
    return get_var(`.:${this.load_var}`)
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
    const result: Type.LoadVarStep = {
      ...this.serialise_base(),
      load_var: get_identifier(this.load_var),
      file: this.file,
      format: this.format,
      reveal: this.reveal,
    }

    return result
  }
}
