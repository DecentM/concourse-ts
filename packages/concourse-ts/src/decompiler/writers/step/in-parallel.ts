import {type_of} from '../../../utils'
import {write_step} from '.'
import {InParallelStep, Pipeline} from '../../../declarations'

import {write_step_base} from './base'

export const write_in_parallel_step = (
  name: string,
  step: InParallelStep,
  pipeline: Pipeline
) => {
  const steps = Array.isArray(step.in_parallel)
    ? step.in_parallel
    : step.in_parallel.steps

  const limit = Array.isArray(step.in_parallel) ? null : step.in_parallel.limit

  const fail_fast = Array.isArray(step.in_parallel)
    ? null
    : step.in_parallel.fail_fast

  return `new InParallelStep(${JSON.stringify(name)}, (step) => {
    ${write_step_base('step', name, step, pipeline)}

    ${
      step.in_parallel
        ? steps
            .map((step, index) => {
              return `step.add_step(${write_step(
                `${name}_step-${index}`,
                step,
                pipeline
              )})`
            })
            .join('\n')
        : ''
    }

    ${type_of(limit) === 'number' ? `step.limit = ${limit}` : ''}

    ${type_of(fail_fast) === 'boolean' ? `step.fail_fast = ${fail_fast}` : ''}
  })`
}
