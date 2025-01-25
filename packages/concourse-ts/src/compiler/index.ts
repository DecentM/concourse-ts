import path from 'node:path'

import { Pipeline } from '../components/pipeline.js'
import { validate } from '../validation/index.js'
import { ValidationWarningType, WarningStore } from '../utils/warning-store/index.js'
import { write_yaml } from './yaml.js'

type CompilationResultFile = {
  filename: string
  content: string
}

export type CompilationResult = {
  warnings: WarningStore
  pipeline: CompilationResultFile
  tasks: CompilationResultFile[]
}

/**
 * Follows the compilation process for a pipeline and transforms results into
 * writable files.
 */
export class Compilation {
  private get_task_path = (filename: string) => {
    return path.join('task', filename)
  }

  private get_pipeline_path = (filename: string) => {
    return path.join('pipeline', filename)
  }

  /**
   * Returns a warning store that contains all warnings and errors about the
   * pipeline. Does not throw even if the pipeline is invalid.
   *
   * @param {Pipeline} input
   * @returns {WarningStore}
   */
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

  /**
   * Compiles a pipeline into a set of files that can be written to disk. Does
   * not throw even if the pipeline is invalid.
   *
   * @param {Pipeline} input
   * @returns {CompilationResult}
   */
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
