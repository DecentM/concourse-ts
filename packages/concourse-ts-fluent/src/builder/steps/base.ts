import { SealedBuilder } from '../../declarations/builder.js'
import { AllStep } from '../step.js'

export abstract class StepBuilderBase<Type extends AllStep>
  implements SealedBuilder<AllStep>
{
  public abstract build(): Type

  protected _name: string

  public name(name: string): typeof this {
    this._name = name

    return this
  }
}
