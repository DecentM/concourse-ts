// https://github.com/concourse/concourse/blob/6e9795b98254c86ca1c5ebed138d427424eae5f1/atc/configvalidate/validate.go#L98

import * as Type from '../../declarations/types'
import {
  Location,
  to_identifier,
  ValidationWarningType,
  WarningStore,
} from '../../utils/warning-store'

import {validate_identifier} from './identifier'

export const validate_groups = (pipeline: Type.Pipeline) => {
  const warnings = new WarningStore()
  const groupNames: Record<string, number> = {}

  pipeline.groups?.forEach((group, index) => {
    const location: Location = {section: 'groups', index}
    const identifier = to_identifier(location, group.name)

    warnings.copy_from(validate_identifier(group.name, identifier))

    const existing = groupNames[group.name]

    if (existing) {
      groupNames[group.name]++
    } else {
      groupNames[group.name] = 1
    }

    // Concourse checks glob validity here, but we generate this section of the
    // config, so we can guarantee that it's fine.

    // TODO: Concourse checks for group resources here, but they're missing from our typings.
  })

  Object.entries(groupNames).forEach(([groupName, groupCount]) => {
    if (groupCount > 1) {
      warnings.add_warning(
        ValidationWarningType.Fatal,
        `group '${groupName}' appears ${groupCount} times. Duplicate names are not allowed.`
      )
    }
  })

  // Check for ungrouped jobs. If at least one job is grouped, ALL jobs must be
  // grouped.
  const jobsGrouped: Record<string, boolean> = {}

  pipeline.jobs?.forEach((job) => {
    jobsGrouped[job.name] =
      pipeline.groups?.some((group) => group.jobs?.includes(job.name)) ?? false
  })

  if (pipeline.groups?.length) {
    Object.entries(jobsGrouped).forEach(([job, grouped]) => {
      if (!grouped) {
        warnings.add_warning(
          ValidationWarningType.Fatal,
          `job ${job} belongs to no group`
        )
      }
    })
  }

  return warnings
}
