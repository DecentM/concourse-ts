import * as Type from '../declarations/types'

import {is_task_step} from '../utils/step-type'

import {ValidationWarningType, WarningStore} from '../utils/warning-store'

export const validate_tasks = (pipeline: Type.Pipeline) => {
  const warnings = new WarningStore()

  pipeline.jobs.forEach((job) => {
    job.plan.forEach((step) => {
      if (!is_task_step(step) || !step.config) {
        return
      }

      const task = step.config

      if (task.image_resource && task.platform !== 'linux') {
        warnings.add_warning(
          ValidationWarningType.NonFatal,
          `Image resources are ignored on "${task.platform}", they're only used on "linux"`
        )
      }
    })
  })

  return warnings
}
