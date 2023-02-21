import {Pipeline, TryStep} from '../../../declarations'
import {write_step_base} from './_base'

import {write_step} from '.'

export const write_try_step = (
  name: string,
  step: TryStep,
  pipeline: Pipeline
): string => {
  return `new TryStep(${JSON.stringify(name)}, (step) => {
    ${write_step_base('step', name, step, pipeline)}

    step.set_try(${write_step(`${name}_try`, step.try, pipeline)})
  })`
}
