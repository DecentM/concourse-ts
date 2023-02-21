import {type_of} from '../../../utils'
import {Pipeline, PutStep} from '../../../declarations'
import {write_step_base} from './_base'
import {write_resource} from '../resource'

export const write_put_step = (
  name: string,
  step: PutStep,
  pipeline: Pipeline
) => {
  return `new PutStep(${JSON.stringify(name)}, (step) => {
    ${write_step_base('step', name, step, pipeline)}

    ${
      step.resource
        ? `step.set_put(${write_resource(step.resource, pipeline)})`
        : ''
    }

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
