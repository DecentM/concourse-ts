import {Pipeline, Step} from '../../../declarations'
import {empty_string_or} from '../../../utils/empty_string_or'
import {parse_duration} from '../../../utils'

import {write_step} from '.'

export const write_step_base = (
  variable_name: string,
  name: string,
  step: Step,
  pipeline: Pipeline
): string => {
  let result = `
    ${empty_string_or(
      step.attempts,
      (attempts) => `${variable_name}.attempts = ${attempts}`
    )}

    ${empty_string_or(
      step.tags,
      (tags) =>
        `${variable_name}.add_tag(${tags
          .map((tag) => JSON.stringify(tag))
          .join(', ')})`
    )}

    ${empty_string_or(
      step.timeout,
      (timeout) =>
        `${variable_name}.set_timeout(${JSON.stringify(
          parse_duration(timeout)
        )})`
    )}
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

  if (step.on_error) {
    result += `${variable_name}.add_on_error(${write_step(
      `${name}_on_error`,
      step.on_error,
      pipeline
    )})`
  }

  return result
}
