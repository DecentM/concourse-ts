import {Customiser} from '../../declarations/customiser'
import * as Type from '../../declarations/types'
import {AnyStep} from '.'

import {Step} from './_base'
import {Resource} from '../resource'

/**
 * https://concourse-ci.org/do-step.html
 */
export class DoStep extends Step<Type.DoStep> {
  private static customiser: Customiser<DoStep>

  /**
   * Customises all DoSteps constructed after calling this function
   *
   * {@link Type.Customiser}
   *
   * @param {Customiser<DoStep>} init
   */
  public static customise = (init: Customiser<DoStep>) => {
    DoStep.customiser = init
  }

  constructor(public override name: string, customise?: Customiser<DoStep>) {
    super(name)

    if (DoStep.customiser) {
      DoStep.customiser(this)
    }

    if (customise) {
      customise(this)
    }
  }

  private do: AnyStep[]

  /**
   * Adds a step after existing steps into this DoStep
   *
   * @param {AnyStep} step
   */
  public add_do = (step: AnyStep) => {
    if (!this.do) this.do = []

    this.do.push(step)
  }

  /**
   * Adds a step that runs before all existing steps in this DoStep
   *
   * @param {AnyStep} step
   */
  public add_do_first = (step: AnyStep) => {
    if (!this.do) this.do = []

    this.do.unshift(step)
  }

  /**
   * @internal Used by the compiler
   *
   * @returns {Resource[]}
   */
  public get_resources(): Resource[] {
    const result = this.get_base_resources()

    this.do.forEach((step) => {
      result.push(...step.get_resources())
    })

    return result
  }

  /**
   * @internal Used by the compiler
   *
   * @returns {Type.DoStep}
   */
  public serialise() {
    const result: Type.DoStep = {
      ...this.serialise_base(),
      do: this.do.map((s) => s.serialise()),
    }

    return result
  }

  /**
   * @internal Used by the decompiler
   *
   * @param {string} name
   * @param {Resource[]} resource_pool
   * @param {Type.DoStep} input
   * @returns {DoStep}
   */
  public static deserialise(
    name: string,
    resource_pool: Resource[],
    input: Type.DoStep
  ) {
    return new DoStep(name, (step) => {
      super.deserialise_base(step, resource_pool, input)

      step.do = input.do.map((planStep, index) => {
        return super.deserialise_any(
          `${name}_plan_${index}`,
          resource_pool,
          planStep
        )
      })
    })
  }
}
