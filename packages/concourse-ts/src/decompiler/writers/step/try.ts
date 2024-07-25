import { Pipeline, TryStep } from '../../../declarations/index.js'
import { write_step_base } from './base.js'

import { write_step } from './index.js'

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
