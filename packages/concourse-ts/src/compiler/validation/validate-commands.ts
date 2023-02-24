import * as Type from '../../declarations/types'

import {is_task_step} from '../../utils/step-type/get-step-type'

import {ValidationWarningType, WarningStore} from '../../utils/warning-store'

export const validate_commands = (pipeline: Type.Pipeline) => {
  const warnings = new WarningStore()

  pipeline.jobs.forEach((job) => {
    job.plan.forEach((step) => {
      if (!is_task_step(step) || !step.config) {
        return
      }

      const command = step.config.run

      if (!command.path) {
        warnings.add_warning(
          ValidationWarningType.Fatal,
          `Command running in "${
            command.dir ?? ''
          }" contains no path. Add a path to a binary to fix this (for example: "/bin/sh").`
        )

        return
      }

      if (!command.path.startsWith('/')) {
        warnings.add_warning(
          ValidationWarningType.NonFatal,
          `Command "${command.path}" uses a binary from $PATH! This makes it vulnerable to injection attacks. Specify the absolute path of the binary to fix this warning. (e.g.: "/bin/sh" instead of "sh")`
        )
      }
    })
  })

  return warnings
}
