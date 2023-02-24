// https://github.com/concourse/concourse/blob/6841cd592dfe844599b73e333ea66c650f2f237b/atc/step_validator.go#L109

import {ValidationWarningType, WarningStore} from '../../../utils/warning-store'
import {is_get_step} from '../../../utils/step-type/get-step-type'

import * as Type from '../../../declarations/types'
import {validate_identifier} from '../validate-identifier'
import {find_job_by_name} from '../../../utils/find-job'
import {visit_step} from '../../../utils/visitors/step'

export const validate_get_steps = (pipeline: Type.Pipeline) => {
  const warnings = new WarningStore()

  pipeline.jobs.forEach((job) => {
    const seen_get_names = []

    job.plan.forEach((step) => {
      if (!is_get_step(step)) {
        return
      }

      warnings.copy_from(validate_identifier(step.get))

      if (seen_get_names.includes(step.get)) {
        warnings.add_warning(
          ValidationWarningType.Fatal,
          `Get step "${step.get}" already exists. To fix this, rename one of the get steps to something else.`
        )
      } else {
        seen_get_names.push(step.get)
      }

      if (step.passed) {
        step.passed.forEach((passed_job) => {
          const job = find_job_by_name(passed_job, pipeline)

          if (!job) {
            warnings.add_warning(
              ValidationWarningType.Fatal,
              `Get step "${step.get}" relies on an unknown job: "${passed_job}"`
            )

            return
          }

          let found_resource = false

          job.plan.forEach((job_step) => {
            visit_step(job_step, {
              GetStep: (other_step) => {
                if (other_step.get === step.get) {
                  found_resource = true
                }
              },

              PutStep: (other_step) => {
                if (other_step.put === step.get) {
                  found_resource = true
                }
              },
            })
          })

          if (!found_resource) {
            warnings.add_warning(
              ValidationWarningType.Fatal,
              `Job "${job.name}" does not interact with resource "${step.get}"`
            )
          }
        })
      }
    })
  })

  return warnings
}
