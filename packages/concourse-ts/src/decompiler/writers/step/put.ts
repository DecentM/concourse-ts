import { Pipeline, PutStep } from '../../../declarations/index.js'
import { write_step_base } from './base.js'
import { write_resource } from '../resource.js'
import { empty_string_or } from '../../../utils/empty_string_or/index.js'

export const write_put_step = (name: string, step: PutStep, pipeline: Pipeline) => {
  return `new PutStep(${JSON.stringify(name)}, (step) => {
    ${write_step_base('step', name, step, pipeline)}

    ${empty_string_or(
      step.resource ?? step.put,
      (resource) => `step.set_put(${write_resource(resource, pipeline)})`
    )}

    ${empty_string_or(
      step.inputs,
      (inputs) => `step.set_inputs(${JSON.stringify(inputs)})`
    )}

    ${empty_string_or(
      step.params,
      (params) => `step.set_params(${JSON.stringify(params)})`
    )}

    ${empty_string_or(
      step.get_params,
      (get_params) => `step.set_get_params(${JSON.stringify(get_params)})`
    )}

    ${empty_string_or(step.no_get, (no_get) => `step.no_get = ${no_get}`)}
  })`
}
