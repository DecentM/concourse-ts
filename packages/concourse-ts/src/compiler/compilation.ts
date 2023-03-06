import {VError} from 'verror'
import * as YAML from 'yaml'
import path from 'node:path'

import {Pipeline} from '../components/pipeline'
import {validate} from './validation'
import {ValidationWarningType, WarningStore} from '../utils/warning-store'
import {Identifier} from '../utils/identifier'

export type CompilationOptions = {
  output_dir?: string
  extract_tasks?: boolean
}

const default_compilation_options: CompilationOptions = {
  output_dir: '.',
  extract_tasks: false,
}

export class Compilation<Group extends Identifier = Identifier> {
  constructor(
    private _options: CompilationOptions = default_compilation_options
  ) {}

  private get options() {
    return {
      ...default_compilation_options,
      ...this._options,
    }
  }

  private input?: Pipeline<Group>

  public set_input(input: Pipeline<Group>) {
    if (this.input) {
      throw new VError(
        'This compilation already has an input. Create a new compilation.'
      )
    }

    this.input = input

    return this
  }

  private get_task_path = (filename: string) => {
    return path.join(this.options.output_dir, 'task', filename)
  }

  private get_pipeline_path = (filename: string) => {
    return path.join(this.options.output_dir, 'pipeline', filename)
  }

  /**
   * Removes embedded tasks from a pipeline and replaces them with
   * their file path, relative to the working directory.
   *
   * @param {Pipeline} input A serialised pipeline to update task paths in
   */
  private transform_task_paths = (input: Pipeline) => {
    const task_steps = input.get_task_steps()

    task_steps.forEach((task_step) => {
      const task = task_step.get_task()

      task_step.set_file(this.get_task_path(`${task.name}.yml`))
    })
  }

  public validate = () => {
    // Validate already checks for falsiness, we just want to check for its
    // constructor here if input exists.
    if (this.input && this.input.constructor.name !== Pipeline.name) {
      const warnings = new WarningStore()

      return warnings.add_warning(
        ValidationWarningType.Fatal,
        'Input is not a pipeline'
      )
    }

    return validate(this.input?.serialise())
  }

  public compile = () => {
    if (!this.input) {
      throw new VError('Cannot get result without input. Call set_input first!')
    }

    const warnings = this.validate()
    const tasks = this.input.get_tasks()

    if (this.options.extract_tasks) {
      this.transform_task_paths(this.input)
    }

    const result = {
      pipeline: {
        filename: this.get_pipeline_path(`${this.input.name}.yml`),
        serialised: this.input.serialise(),
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
