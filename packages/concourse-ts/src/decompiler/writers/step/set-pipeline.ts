import { Pipeline, SetPipelineStep } from '../../../declarations/index.js'
import { write_step_base } from './base.js'
import { empty_string_or } from '../../../utils/empty_string_or'

export const write_set_pipeline_step = (
  name: string,
  step: SetPipelineStep,
  pipeline: Pipeline
): string => {
  return `new SetPipelineStep(${JSON.stringify(name)}, (step) => {
    ${write_step_base('step', name, step, pipeline)}

    ${empty_string_or(
      step.set_pipeline,
      (set_pipeline) => `step.set_pipeline = ${JSON.stringify(set_pipeline)}`
    )}

    ${empty_string_or(step.file, (file) => `step.file = ${JSON.stringify(file)}`)}

    ${empty_string_or(
      step.instance_vars,
      (instance_vars) => `step.set_instance_vars(${JSON.stringify(instance_vars)})`
    )}

    ${empty_string_or(step.vars, (vars) => `step.set_vars(${JSON.stringify(vars)})`)}

    ${empty_string_or(
      step.var_files,
      (var_files) =>
        `step.add_var_file(${var_files
          .map((var_file) => JSON.stringify(var_file))
          .join(', ')})`
    )}

    ${empty_string_or(step.team, (team) => `step.team = ${JSON.stringify(team)}`)}
  })`
}
