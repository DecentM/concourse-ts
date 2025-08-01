import { DoStep, Pipeline } from '../../../declarations/index.js'

import { write_step_base } from './base.js'
import { write_step } from './index.js'
import { empty_string_or } from '../../../utils/empty_string_or/index.js'

export const write_do_step = (name: string, step: DoStep, pipeline: Pipeline) => {
  return `new DoStep(${JSON.stringify(name)}, (step) => {
    ${write_step_base('step', name, step, pipeline)}

    ${empty_string_or(step.do, (do_step) =>
      do_step
        .map((step) => {
          return `step.add_steps(${write_step(name, step, pipeline)})`
        })
        .join('\n')
    )}
  })`
}
