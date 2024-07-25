import { GetStep, Pipeline } from '../../../declarations/index.js'
import { write_step_base } from './base.js'
import { write_resource } from '../resource.js'
import { empty_string_or } from '../../../utils/empty_string_or'

export const write_get_step = (name: string, step: GetStep, pipeline: Pipeline) => {
  return `new GetStep(${JSON.stringify(name)}, (step) => {
    ${write_step_base('step', name, step, pipeline)}

    ${empty_string_or(
      step.resource ?? step.get,
      (resource) => `step.set_get(${write_resource(resource, pipeline)})`
    )}

    ${empty_string_or(step.passed, (passed) =>
      passed
        .map((job) => {
          return `step.add_passed({name: ${JSON.stringify(job)}})`
        })
        .join('\n')
    )}

    ${empty_string_or(
      step.params,
      (params) => `step.set_params(${JSON.stringify(params)})`
    )}

    ${empty_string_or(
      step.trigger,
      (trigger) => `step.trigger = ${JSON.stringify(trigger)}`
    )}

    ${empty_string_or(
      step.version,
      (version) => `step.version = ${JSON.stringify(version)}`
    )}
  })`
}
