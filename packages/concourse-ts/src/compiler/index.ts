import * as YAML from 'yaml'
import path from 'node:path'

import {Pipeline} from '../components/pipeline'
import {validate} from '../validation'
import {ValidationWarningType, WarningStore} from '../utils/warning-store'

type CompilationResultFile = {
  filename: string
  content: string
}

export type CompilationResult = {
  warnings: WarningStore
  pipeline: CompilationResultFile
  tasks: CompilationResultFile[]
}

export class Compilation {
  private get_task_path = (filename: string) => {
    return path.join('task', filename)
  }

  private get_pipeline_path = (filename: string) => {
    return path.join('pipeline', filename)
  }

  public validate = (input: Pipeline) => {
    // Validate already checks for falsiness, we just want to check for its
    // constructor here if input exists.
    if (input && input.constructor.name !== Pipeline.name) {
      const warnings = new WarningStore()

      return warnings.add_warning(
        ValidationWarningType.Fatal,
        'Input is not a pipeline'
      )
    }

    return validate(input.serialise())
  }

  public compile = (input: Pipeline): CompilationResult => {
    const warnings = this.validate(input)
    const tasks = input.get_tasks()

    const result = {
      pipeline: {
        filename: this.get_pipeline_path(`${input.name}.yml`),
        serialised: input.serialise(),
      },
      tasks: tasks.map((task) => ({
        filename: this.get_task_path(`${task.name}.yml`),
        serialised: task.serialise(),
      })),
    }

    return {
      warnings,
      pipeline: {
        filename: result.pipeline.filename,
        content: YAML.stringify(result.pipeline.serialised),
      },
      tasks: result.tasks.map((task) => ({
        filename: task.filename,
        content: YAML.stringify(task.serialised),
      })),
    }
  }
}
