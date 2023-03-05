// https://github.com/concourse/concourse/blob/6e9795b98254c86ca1c5ebed138d427424eae5f1/atc/configvalidate/validate.go#L216

import * as Type from '../../declarations/types'
import {
  Location,
  to_identifier,
  ValidationWarningType,
  WarningStore,
} from '../../utils/warning-store'

import {validate_identifier} from './validate-identifier'

export const validate_resource_types = (
  pipeline: Type.Pipeline,
  seen_types: Record<string, Location>
): WarningStore => {
  const warnings = new WarningStore()

  pipeline.resource_types?.forEach((resource_type, index) => {
    const location: Location = {section: 'resource_types', index}
    const identifier = to_identifier(location, resource_type.name)

    warnings.copy_from(validate_identifier(resource_type.name))

    const existing = seen_types[resource_type.name]

    if (existing) {
      warnings.add_warning(
        ValidationWarningType.Fatal,
        `${existing.index} and ${location.index} have the same name ('${resource_type.name}')`
      )
    } else if (resource_type.name) {
      seen_types[resource_type.name] = location
    }

    if (!resource_type.name) {
      warnings.add_warning(
        ValidationWarningType.Fatal,
        `${identifier} has no name`
      )
    }

    if (!resource_type.type) {
      warnings.add_warning(
        ValidationWarningType.Fatal,
        `${identifier} has no type`
      )

      return
    }

    if (resource_type.type !== 'registry-image') {
      warnings.add_warning(
        ValidationWarningType.NonFatal,
        `Resource type "${identifier}" is not based on registry-image, some workers may be missing "${resource_type.type}".`
      )
    }
  })

  return warnings
}
