import {Pipeline, TaskStep} from '../../../declarations'
import {write_step_base} from './base'
import {write_task} from '../task'
import {empty_string_or} from '../../../utils/empty_string_or'

export const write_task_step = (
  name: string,
  step: TaskStep,
  pipeline: Pipeline
): string => {
  return `new TaskStep(${JSON.stringify(name)}, (step) => {
    ${write_step_base('step', name, step, pipeline)}

    ${empty_string_or(
      step.config,
      (config) => `step.set_task(${write_task(step.task, config)})`
    )}

    ${empty_string_or(
      step.file,
      (file) => `step.set_file(${JSON.stringify(file)})`
    )}

    ${empty_string_or(
      step.image,
      (image) => `step.image = ${JSON.stringify(image)}`
    )}

    ${empty_string_or(
      step.privileged,
      (privileged) => `step.privileged = ${privileged}`
    )}

    ${empty_string_or(
      step.vars,
      (vars) => `step.set_vars(${JSON.stringify(vars)})`
    )}

    ${empty_string_or(
      step.params,
      (params) => `step.set_params(${JSON.stringify(params)})`
    )}

    ${empty_string_or(step.input_mapping, (input_mapping) =>
      Object.entries(input_mapping)
        .map(([name, value]) => {
          return `step.set_input_mapping(${JSON.stringify(
            name
          )}, ${JSON.stringify(value)})`
        })
        .join('\n')
    )}

    ${empty_string_or(step.output_mapping, (output_mapping) =>
      Object.entries(output_mapping)
        .map(([name, value]) => {
          return `step.set_output_mapping(${JSON.stringify(
            name
          )}, ${JSON.stringify(value)})`
        })
        .join('\n')
    )}
  })`
}
