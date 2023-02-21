import {type_of} from '../../../utils'
import {Pipeline, SetPipelineStep} from '../../../declarations'
import {write_step_base} from './_base'

export const write_set_pipeline_step = (
  name: string,
  step: SetPipelineStep,
  pipeline: Pipeline
): string => {
  return `new SetPipelineStep(${JSON.stringify(name)}, (step) => {
    ${write_step_base('step', name, step, pipeline)}

    ${
      type_of(step.set_pipeline) !== 'undefined'
        ? `step.set_pipeline = ${JSON.stringify(step.set_pipeline)}`
        : ''
    }

    ${
      type_of(step.file) !== 'undefined'
        ? `step.file = ${JSON.stringify(step.file)}`
        : ''
    }

    ${Object.entries(step.instance_vars)
      .map(([varName, varValue]) => {
        return `step.set_instance_var(${JSON.stringify(
          varName
        )}, ${JSON.stringify(varValue)}})`
      })
      .join('\n')}

    ${Object.entries(step.vars)
      .map(([varName, varValue]) => {
        return `step.set_var(${JSON.stringify(varName)}, ${JSON.stringify(
          varValue
        )}})`
      })
      .join('\n')}

    ${
      step.var_files
        ? `step.add_var_file(...${JSON.stringify(step.var_files)})`
        : ''
    }

    ${
      type_of(step.team) !== 'undefined'
        ? `step.team = ${JSON.stringify(step.team)}`
        : ''
    }
  })`
}
