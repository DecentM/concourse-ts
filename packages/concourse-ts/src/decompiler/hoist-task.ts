import fs from 'fs'
import path from 'path'
import {VError} from 'verror'
import * as YAML from 'yaml'

import {Pipeline, Task, TaskStep} from '../declarations'
import {Identifier} from '../utils/identifier'
import {is_task} from '../utils/is-task'
import {is_task_step} from '../utils/step-type'

export const hoist_task = (
  work_dir: string,
  task_step: TaskStep
): Task<Identifier, Identifier> => {
  if (!task_step.file) {
    return null
  }

  const file_path = path.resolve(work_dir, task_step.file)
  const file_contents = fs.readFileSync(file_path)
  const task = YAML.parse(file_contents.toString('utf-8'))

  if (!is_task(task)) {
    throw new VError(
      `File at "${file_path}" does not contain a valid task definition`
    )
  }

  return task
}

export const hoist_all_tasks = (
  work_dir: string,
  pipeline: Pipeline
): Pipeline => {
  pipeline.jobs.map((job) =>
    job.plan.map((step) => {
      if (!is_task_step(step)) {
        return
      }

      if (!step.file) {
        return
      }

      step.config = hoist_task(work_dir, step)
      Reflect.deleteProperty(step, 'file')
    })
  )

  return pipeline
}
