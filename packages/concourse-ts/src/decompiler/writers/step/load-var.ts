import {type_of} from '../../../utils'
import {LoadVarStep, Pipeline} from '../../../declarations'
import {write_step_base} from './_base'

export const write_load_var_step = (
  name: string,
  step: LoadVarStep,
  pipeline: Pipeline
) => {
  return `new LoadVarStep(${JSON.stringify(name)}, (step) => {
    ${write_step_base('step', name, step, pipeline)}

    ${
      type_of(step.load_var) !== 'undefined'
        ? `step.load_var = ${JSON.stringify(step.load_var)}`
        : ''
    }

    ${
      type_of(step.file) !== 'undefined'
        ? `step.file = ${JSON.stringify(step.file)}`
        : ''
    }

    ${
      type_of(step.format) !== 'undefined'
        ? `step.format = ${JSON.stringify(step.format)}`
        : ''
    }

    ${
      type_of(step.reveal) !== 'undefined'
        ? `step.reveal = ${step.reveal ?? 'undefined'}`
        : ''
    }
  })`
}
