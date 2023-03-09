import {DoStep, Pipeline} from '../../../declarations'

import {write_step_base} from './base'
import {write_step} from '.'
import {empty_string_or} from '../../../utils/empty_string_or'

export const write_do_step = (
  name: string,
  step: DoStep,
  pipeline: Pipeline
) => {
  return `new DoStep(${JSON.stringify(name)}, (step) => {
    ${write_step_base('step', name, step, pipeline)}

    ${empty_string_or(step.do, (do_step) =>
      do_step
        .map((step) => {
          return `step.add_do(${write_step(name, step, pipeline)})`
        })
        .join('\n')
    )}
  })`
}
