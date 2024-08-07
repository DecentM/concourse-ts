import fs from 'node:fs'
import path from 'node:path'
import * as YAML from 'yaml'

import { Pipeline, Task, TaskStep, Transformer } from '../../declarations/index.js'
import { Identifier } from '../identifier/index.js'
import { is_task } from '../is-task/index.js'
import { is_task_step } from '../step-type/index.js'

/**
 * Returns the serialised task for a given task step, if the passed task step
 * has a "file" property. Returns undefined if the task step doesn't have a
 * "file" property.
 *
 * @internal Used by `apply_task_hoisting`
 *
 * @param {string} work_dir This directory is used as root for relative paths
 * @param {TaskStep} task_step The task step to read
 * @returns {Task | undefined} The task, or undefined if the file is not a task
 */
const hoist_task = (
  work_dir: string,
  task_step: TaskStep
): Task<Identifier, Identifier> | undefined => {
  const file_path = path.resolve(work_dir, task_step.file)
  const file_contents = fs.readFileSync(file_path)
  const task = YAML.parse(file_contents.toString('utf-8'))

  if (!is_task(task)) {
    return undefined
  }

  return task
}

export type TaskHoistingOptions = {
  work_dir: string
}

/**
 * Modifies a Pipeline *in-place* by reading task files and embedding the task
 * configuration into the Pipeline instance.
 *
 * @param {string} work_dir This directory is used as root for relative paths
 * @param {Pipeline} pipeline The pipeline to modify
 * @returns {Pipeline} The same pipeline instance
 */
export const apply_task_hoisting: Transformer<TaskHoistingOptions> = (
  pipeline: Pipeline,
  options = {
    work_dir: '.',
  }
): void => {
  for (const job of pipeline.jobs) {
    for (const step of job.plan) {
      if (!is_task_step(step)) {
        continue
      }

      if (!step.file) {
        continue
      }

      step.config = hoist_task(options.work_dir, step)
      step.file = undefined
    }
  }
}
