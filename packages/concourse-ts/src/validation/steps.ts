// https://github.com/concourse/concourse/blob/6e9795b98254c86ca1c5ebed138d427424eae5f1/atc/configvalidate/validate.go#L253

import * as Type from '../declarations/types.js'
import { ValidationWarningType, WarningStore } from '../utils/warning-store/index.js'

export const validate_steps = (pipeline: Type.Pipeline) => {
  const warnings = new WarningStore()

  for (const job of pipeline.jobs) {
    for (const step of job.plan) {
      if ('aggregate' in step) {
        warnings.add_warning(
          ValidationWarningType.Fatal,
          `Job "${job.name}" contains an aggregate step. Replace the aggregate step with an in_parallel step to fix this.`
        )
      }
    }
  }

  return warnings
}
