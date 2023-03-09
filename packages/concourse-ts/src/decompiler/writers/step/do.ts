import {DoStep, Pipeline} from '../../../declarations'

import {write_step_base} from './base'
import {write_step} from '.'

export const write_do_step = (
  name: string,
  step: DoStep,
  pipeline: Pipeline
) => {
  return `new DoStep(${JSON.stringify(name)}, (step) => {
    ${write_step_base('step', name, step, pipeline)}

    ${step.do
      .map((step) => {
        return `step.add_do(${write_step(name, step, pipeline)})`
      })
      .join('\n')}
  })`
}
