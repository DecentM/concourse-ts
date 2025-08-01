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
      (load_var) => `step.set_load_var(${JSON.stringify(load_var)})`
    )}

    ${empty_string_or(step.file, (file) => `step.set_file(${JSON.stringify(file)})`)}

    ${empty_string_or(
      step.format,
      (format) => `step.set_format(${JSON.stringify(format)})`
    )}

    ${empty_string_or(step.reveal, () => `step.set_reveal()`)}
  })`
}
