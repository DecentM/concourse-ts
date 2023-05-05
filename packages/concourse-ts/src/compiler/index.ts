import * as YAML from 'yaml'
import path from 'node:path'

import {Pipeline} from '../components/pipeline'
import {validate} from '../validation'
import {ValidationWarningType, WarningStore} from '../utils/warning-store'

export type CompilationOptions = {
  output_dir?: string
}

const default_compilation_options: CompilationOptions = {
  output_dir: '.',
}

type CompilationResultFile = {
  filepath: string
  content: string
}

export type CompilationResult = {
  warnings: WarningStore
  pipeline: CompilationResultFile
  tasks: CompilationResultFile[]
}

export class Compilation {
  constructor(
    private _options: CompilationOptions = default_compilation_options
  ) {}

  private get options() {
    return {
      ...default_compilation_options,
      ...this._options,
    }
  }

  private get_task_path = (filename: string) => {
    return path.join(this.options.output_dir, 'task', filename)
  }

  private get_pipeline_path = (filename: string) => {
    return path.join(this.options.output_dir, 'pipeline', filename)
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
        filepath: result.pipeline.filename,
        content: YAML.stringify(result.pipeline.serialised),
      },
      tasks: result.tasks.map((task) => ({
        filepath: task.filename,
        content: YAML.stringify(task.serialised),
      })),
    }
  }
}
