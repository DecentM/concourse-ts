import {write_step} from '.'
import {InParallelStep, Pipeline} from '../../../declarations'
import {empty_string_or} from '../../../utils/empty_string_or'

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

    ${empty_string_or(steps, () =>
      steps
        .map((step, index) => {
          return `step.add_step(${write_step(
            `${name}_step-${index}`,
            step,
            pipeline
          )})`
        })
        .join('\n')
    )}

    ${empty_string_or(limit, () => `step.limit = ${limit}`)}

    ${empty_string_or(fail_fast, () => `step.fail_fast = ${fail_fast}`)}
  })`
}
