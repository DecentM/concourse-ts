import { LoadVarStep, Pipeline } from '../../../declarations/index.js'
import { write_step_base } from './base.js'
import { empty_string_or } from '../../../utils/empty_string_or/index.js'

export const write_load_var_step = (
  name: string,
  step: LoadVarStep,
  pipeline: Pipeline
) => {
  return `new LoadVarStep(${JSON.stringify(name)}, (step) => {
    ${write_step_base('step', name, step, pipeline)}

    ${empty_string_or(
      step.load_var,
      (load_var) => `step.load_var = ${JSON.stringify(load_var)}`
    )}

    ${empty_string_or(step.file, (file) => `step.file = ${JSON.stringify(file)}`)}

    ${empty_string_or(
      step.format,
      (format) => `step.format = ${JSON.stringify(format)}`
    )}

    ${empty_string_or(step.reveal, (reveal) => `step.reveal = ${reveal}`)}
  })`
}
