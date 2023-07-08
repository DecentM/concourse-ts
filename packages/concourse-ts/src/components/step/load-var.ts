import {Customiser} from '../../declarations/customiser'
import * as Type from '../../declarations/types'

import {get_identifier} from '../../utils/identifier'
import {get_var} from '../../utils/var'

import {Resource} from '../resource'

import {Step} from './base'

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

  public load_var?: string

  public file?: Type.FilePath

  public format?: Type.LoadVarStep['format']

  public reveal: boolean

  public get var() {
    return get_var(`.:${this.load_var}`)
  }

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
