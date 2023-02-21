import {type_of} from '../../../utils'
import {Pipeline, Step} from '../../../declarations'

import {write_step} from '.'

export const write_step_base = (
  variable_name: string,
  name: string,
  step: Step,
  pipeline: Pipeline
): string => {
  let result = `
    ${
      type_of(step.attempts) !== 'undefined'
        ? `${variable_name}.attempts = ${step.attempts}`
        : ''
    }

    ${
      type_of(step.tags) !== 'undefined'
        ? `${variable_name}.tags = ${JSON.stringify(step.tags)}`
        : ''
    }

    ${
      type_of(step.timeout) !== 'undefined'
        ? `${variable_name}.timeout = ${JSON.stringify(step.timeout)}`
        : ''
    }
  `

  if (step.ensure) {
    result += `${variable_name}.add_ensure(${write_step(
      `${name}_ensure`,
      step.ensure,
      pipeline
    )})`
  }

  if (step.on_abort) {
    result += `${variable_name}.add_on_abort(${write_step(
      `${name}_on_abort`,
      step.on_abort,
      pipeline
    )})`
  }

  if (step.on_failure) {
    result += `${variable_name}.add_on_failure(${write_step(
      `${name}_on_failure`,
      step.on_failure,
      pipeline
    )})`
  }

  if (step.on_success) {
    result += `${variable_name}.add_on_success(${write_step(
      `${name}_on_success`,
      step.on_success,
      pipeline
    )})`
  }

  return result
}
