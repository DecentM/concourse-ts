// https://github.com/concourse/concourse/blob/6e9795b98254c86ca1c5ebed138d427424eae5f1/atc/configvalidate/validate.go#L323

import * as Type from '../declarations/types'
import {
  Location,
  to_identifier,
  ValidationWarningType,
  WarningStore,
} from '../utils/warning-store'

import { validate_identifier } from './identifier'

export const validate_jobs = (pipeline: Type.Pipeline) => {
  const warnings = new WarningStore()
  const names: Record<string, Location> = {}

  if (!pipeline.jobs || pipeline.jobs.length === 0) {
    return warnings.add_warning(
      ValidationWarningType.Fatal,
      'pipeline must contain at least one job'
    )
  }

  pipeline.jobs.forEach((job, index) => {
    const location: Location = { section: 'jobs', index }
    const identifier = to_identifier(location, job.name)

    warnings.copy_from(validate_identifier(job.name, `jobs[${index}]`))

    const existing = names[job.name]

    if (existing) {
      warnings.add_warning(
        ValidationWarningType.Fatal,
        `job ${existing.index} and ${location.index} have the same name: "${job.name}"`
      )
    } else if (job.name) {
      names[job.name] = location
    }

    // We abstract this away in concourse-ts, only build_log_retention is used,
    // build_logs_to_retain will always be serialised to undefined
    if (job.build_log_retention && job.build_logs_to_retain) {
      warnings.add_warning(
        ValidationWarningType.Fatal,
        `${identifier} can't use both build_log_retention and build_logs_to_retain`
      )
    } else if (job.build_logs_to_retain < 0) {
      warnings.add_warning(
        ValidationWarningType.Fatal,
        `${identifier} has negative build_logs_to_retain: ${job.build_logs_to_retain}`
      )
    }

    if (job.build_log_retention) {
      if (job.build_log_retention.builds < 0) {
        warnings.add_warning(
          ValidationWarningType.Fatal,
          `${identifier} has negative build_log_retention.builds: ${job.build_log_retention.builds}`
        )
      }

      if (job.build_log_retention.days < 0) {
        warnings.add_warning(
          ValidationWarningType.Fatal,
          `${identifier} has negative build_log_retention.days: ${job.build_log_retention.days}`
        )
      }

      if (job.build_log_retention.minimum_succeeded_builds < 0) {
        warnings.add_warning(
          ValidationWarningType.Fatal,
          `${identifier} has negative build_log_retention.minimum_succeeded_builds: ${job.build_log_retention.minimum_succeeded_builds}`
        )
      }

      if (
        job.build_log_retention.builds > 0 &&
        job.build_log_retention.minimum_succeeded_builds >
          job.build_log_retention.builds
      ) {
        warnings.add_warning(
          ValidationWarningType.Fatal,
          `${identifier} has build_log_retention.min_success_builds: ${job.build_log_retention.minimum_succeeded_builds} greater than build_log_retention.min_success_builds: ${job.build_log_retention.builds}`
        )
      }
    }

    // TODO: Validate step (?)
    //       https://github.com/concourse/concourse/blob/6e9795b98254c86ca1c5ebed138d427424eae5f1/atc/configvalidate/validate.go#L398
  })

  return warnings
}
