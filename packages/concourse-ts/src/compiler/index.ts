import path from 'node:path'

import {Pipeline} from '../components/pipeline'
import {validate} from '../validation'
import {ValidationWarningType, WarningStore} from '../utils/warning-store'
import {write_yaml} from './yaml'

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

    return {
      warnings,
      pipeline: {
        filename: this.get_pipeline_path(`${input.name}.yml`),
        content: write_yaml(input.serialise()),
      },
      tasks: tasks.map((task) => ({
        filename: this.get_task_path(`${task.name}.yml`),
        content: write_yaml(task.serialise()),
      })),
    }
  }
}
