import {type_of} from '../../../utils'
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

    ${
      type_of(step.inputs) !== 'undefined'
        ? `step.set_inputs(${JSON.stringify(step.inputs)})`
        : ''
    }

    ${
      type_of(step.params) !== 'undefined'
        ? `step.set_params(${JSON.stringify(step.params)})`
        : ''
    }

    ${
      type_of(step.get_params) !== 'undefined'
        ? `step.set_get_param(...${JSON.stringify(step.get_params)})`
        : ''
    }
  })`
}
