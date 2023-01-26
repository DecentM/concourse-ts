import {VError} from 'verror'
import * as YAML from 'yaml'
import path from 'node:path'

import {Pipeline} from '../components/pipeline'
import {validate} from './validation'
import {ValidationWarningType, WarningStore} from './validation/declarations'
import * as Type from '../declarations/types'

export class Compilation<Group extends string = string> {
  constructor(private output_dir: string) {}

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
    return path.join(this.output_dir, 'task', filename)
  }

  private get_pipeline_path = (filename: string) => {
    return path.join(this.output_dir, 'pipeline', filename)
  }

  /**
   * Removes embedded tasks from a serialised pipeline and replaces them with
   * their file path, relative to the working directory.
   *
   * @param {Pipeline} input A serialised pipeline to update task paths in
   * @returns {Pipeline} A clone of the input with the task paths modified
   */
  private transform_task_paths = <Pipeline extends Type.Pipeline>(
    input: Pipeline
  ): Pipeline => {
    return {
      ...input,
      jobs: input.jobs.map(
        (job): Type.Job => ({
          ...job,
          plan: job.plan.map((step): Type.Step => {
            if (!('task' in step)) {
              return step
            }

            return {
              ...step,
              task: undefined,
              file: this.get_task_path(step.file),
            }
          }),
        })
      ),
    }
  }

  private get_result() {
    const tasks = this.input?.get_tasks()

    return {
      pipeline: {
        filename: this.get_pipeline_path(this.input.filename),
        serialised: this.transform_task_paths(this.input?.serialise()),
      },
      tasks: tasks?.map((task) => ({
        filename: this.get_task_path(task.filename),
        serialised: task.serialise(),
      })),
    }
  }

  public validate = () => {
    if (!this.input || this.input?.constructor.name !== Pipeline.name) {
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

    if (warnings.has_fatal()) {
      throw new VError(
        'This pipeline has fatal errors, compilation aborted.',
        ...warnings.get_warnings()
      )
    }

    const result = this.get_result()

    return {
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
