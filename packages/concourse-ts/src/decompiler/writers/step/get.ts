import {type_of} from '../../../utils'
import {GetStep, Pipeline} from '../../../declarations'
import {write_step_base} from './_base'
import {write_resource} from '../resource'

export const write_get_step = (
  name: string,
  step: GetStep,
  pipeline: Pipeline
) => {
  return `new GetStep(${JSON.stringify(name)}, (step) => {
    ${write_step_base('step', name, step, pipeline)}

    ${
      type_of(step.resource) !== 'undefined'
        ? `step.set_get(${write_resource(step.resource, pipeline)})`
        : ''
    }

    ${step.passed
      .map((job) => {
        return `step.add_passed(${JSON.stringify(job)})`
      })
      .join('\n')}

    ${
      type_of(step.params) !== 'undefined'
        ? `step.set_params(${JSON.stringify(step.params)})`
        : ''
    }

    ${
      type_of(step.trigger) !== 'undefined'
        ? `step.trigger = ${JSON.stringify(step.trigger)}`
        : ''
    }

    ${
      type_of(step.version) !== 'undefined'
        ? `step.version = ${JSON.stringify(step.version)}`
        : ''
    }
  })`
}
