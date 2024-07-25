import * as Type from '../declarations/types.js'

import { is_task_step } from '../utils/step-type/index.js'

import { ValidationWarningType, WarningStore } from '../utils/warning-store/index.js'

export const validate_tasks = (pipeline: Type.Pipeline) => {
  const warnings = new WarningStore()

  for (const job of pipeline.jobs) {
    for (const step of job.plan) {
      if (!is_task_step(step) || !step.config) {
        continue
      }

      const task = step.config

      if (task.image_resource && task.platform !== 'linux') {
        warnings.add_warning(
          ValidationWarningType.NonFatal,
          `Image resources are ignored on "${task.platform}", they're only used on "linux"`
        )
      }
    }
  }

  return warnings
}
