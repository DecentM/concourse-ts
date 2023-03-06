// https://github.com/concourse/concourse/blob/6e9795b98254c86ca1c5ebed138d427424eae5f1/atc/configvalidate/validate.go#L98

import * as Type from '../declarations/types'
import {
  Location,
  to_identifier,
  ValidationWarningType,
  WarningStore,
} from '../utils/warning-store'

import {validate_identifier} from './identifier'

export const validate_groups = (pipeline: Type.Pipeline) => {
  const warnings = new WarningStore()
  const group_names: Record<string, number> = {}

  pipeline.groups?.forEach((group, index) => {
    const location: Location = {section: 'groups', index}
    const identifier = to_identifier(location, group.name)

    warnings.copy_from(validate_identifier(group.name, identifier))

    const existing = group_names[group.name]

    if (existing) {
      group_names[group.name]++
    } else {
      group_names[group.name] = 1
    }

    // Concourse checks glob validity here, but we generate this section of the
    // config, so we can guarantee that it's fine.

    // TODO: Concourse checks for group resources here, but they're missing from our typings.
  })

  Object.entries(group_names).forEach(([group_name, group_count]) => {
    if (group_count > 1) {
      warnings.add_warning(
        ValidationWarningType.Fatal,
        `group "${group_name}" appears ${group_count} times. Duplicate names are not allowed.`
      )
    }
  })

  if (pipeline.groups && pipeline.groups.length) {
    // Check for ungrouped jobs. If at least one job is grouped, ALL jobs must be
    // grouped.
    const jobs_grouped: Record<string, boolean> = {}

    pipeline.jobs.forEach((job) => {
      jobs_grouped[job.name] = pipeline.groups.some((group) =>
        group.jobs?.includes(job.name)
      )
    })

    Object.entries(jobs_grouped).forEach(([job, grouped]) => {
      if (!grouped) {
        warnings.add_warning(
          ValidationWarningType.Fatal,
          `job "${job}" belongs to no group`
        )
      }
    })
  }

  return warnings
}
