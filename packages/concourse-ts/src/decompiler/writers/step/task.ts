import {type_of} from '../../../utils'
import {Pipeline, TaskStep} from '../../../declarations'
import {write_step_base} from './base'
import {write_task} from '../task'

export const write_task_step = (
  name: string,
  step: TaskStep,
  pipeline: Pipeline
): string => {
  return `new TaskStep(${JSON.stringify(name)}, (step) => {
    ${write_step_base('step', name, step, pipeline)}

    ${
      step.config
        ? `step.set_task(${write_task(`${name}_task`, step.config)})`
        : ''
    }

    ${
      type_of(step.file) !== 'undefined'
        ? `step.set_file(${JSON.stringify(step.file)})`
        : ''
    }

    ${
      type_of(step.image) !== 'undefined'
        ? `step.image = ${JSON.stringify(step.image)}`
        : ''
    }

    ${
      type_of(step.privileged) !== 'undefined'
        ? `step.privileged = ${step.privileged}`
        : ''
    }

    ${Object.entries(step.vars ?? {})
      .map(([varName, varValue]) => {
        return `step.set_var(${JSON.stringify(varName)}, ${JSON.stringify(
          varValue
        )})`
      })
      .join('\n')}

    ${Object.entries(step.params ?? {})
      .filter(
        ([, value]) =>
          type_of(value) !== 'null' && type_of(value) !== 'undefined'
      )
      .map(([paramName, paramValue]) => {
        return `step.set_param({
          key: ${JSON.stringify(paramName)},
          value: ${JSON.stringify(String(paramValue))}
        })`
      })
      .join('\n')}

    ${Object.entries(step.input_mapping ?? {})
      .map(([name, value]) => {
        return `step.set_input_mapping(${JSON.stringify(
          name
        )}, ${JSON.stringify(value)})`
      })
      .join('\n')}

    ${Object.entries(step.output_mapping ?? {})
      .map(([name, value]) => {
        return `step.set_output_mapping(${JSON.stringify(
          name
        )}, ${JSON.stringify(value)})`
      })
      .join('\n')}
  })`
}
