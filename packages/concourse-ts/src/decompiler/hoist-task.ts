import fs from 'fs'
import path from 'path'
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
    return null
  }

  return task
}

export const hoist_all_tasks = (
  work_dir: string,
  pipeline: Pipeline
): Pipeline => {
  pipeline.jobs.forEach((job) =>
    job.plan.forEach((step) => {
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
