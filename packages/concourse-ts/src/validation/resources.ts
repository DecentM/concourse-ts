// https://github.com/concourse/concourse/blob/6e9795b98254c86ca1c5ebed138d427424eae5f1/atc/configvalidate/validate.go#L175

import * as Type from '../declarations/types'
import {
  Location,
  to_identifier,
  ValidationWarningType,
  WarningStore,
} from '../utils/warning-store'

import {validate_identifier} from './identifier'

export const validate_resources = (
  pipeline: Type.Pipeline,
  seenTypes: Record<string, Location>
): WarningStore => {
  const warnings = new WarningStore()

  pipeline.resources?.forEach((resource, index) => {
    const location: Location = {section: 'resources', index}
    const identifier = to_identifier(location, resource.name)

    warnings.copy_from(validate_identifier(resource.name, identifier))

    const existing = seenTypes[resource.name]

    if (existing) {
      warnings.add_warning(
        ValidationWarningType.Fatal,
        `Resource ${existing.index} and ${location.index} have the same name: "${resource.name}"`
      )
    } else if (resource.name) {
      seenTypes[resource.name] = location
    }

    if (!resource.type) {
      warnings.add_warning(
        ValidationWarningType.Fatal,
        `Resource "${identifier}" has no type`
      )
    }
  })

  return warnings
}
