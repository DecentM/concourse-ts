import {Customiser} from '../../declarations/customiser'
import {Identifier} from '../../utils/identifier'
import * as Type from '../../declarations/types'
import {Resource} from '../resource'

import {Step} from './_base'

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

  public load_var?: Identifier

  public file?: Type.FilePath

  public format?: Type.LoadVarStep['format']

  public reveal: boolean

  public get_resources(): Resource[] {
    return this.get_base_resources()
  }

  public serialise() {
    const result: Type.LoadVarStep = {
      ...this.serialise_base(),
      load_var: this.load_var,
      file: this.file,
      format: this.format,
      reveal: this.reveal,
    }

    return result
  }

  public static deserialise(
    name: string,
    resourcePool: Resource[],
    input: Type.LoadVarStep
  ) {
    return new LoadVarStep(name, (step) => {
      this.deserialise_base(step, resourcePool, input)

      step.load_var = input.load_var
      step.file = input.file
      step.format = input.format
      step.reveal = input.reveal
    })
  }
}
