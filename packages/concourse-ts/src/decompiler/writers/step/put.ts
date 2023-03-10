import {Pipeline, PutStep} from '../../../declarations'
import {write_step_base} from './base'
import {write_resource} from '../resource'
import {empty_string_or} from '../../../utils/empty_string_or'

export const write_put_step = (
  name: string,
  step: PutStep,
  pipeline: Pipeline
) => {
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

    ${empty_string_or(step.get_params, (get_params) =>
      Object.entries(get_params)
        .map(([name, value]) => {
          return `step.set_get_param({key: ${JSON.stringify(
            name
          )}, value: ${JSON.stringify(value)}})`
        })
        .join('\n')
    )}
  })`
}
