// https://github.com/concourse/concourse/blob/6e9795b98254c86ca1c5ebed138d427424eae5f1/atc/configvalidate/validate.go#L216

import * as Type from '../../declarations/types'
import {
  Location,
  to_identifier,
  ValidationWarningType,
  WarningStore,
} from './declarations'
import {validateIdentifier} from './validate-identifier'

export const validateResourceTypes = (
  c: Type.Pipeline,
  seenTypes: Record<string, Location>
): WarningStore => {
  const warnings = new WarningStore()

  c.resource_types.forEach((resource_type, index) => {
    const location: Location = {section: 'resource_types', index}
    const identifier = to_identifier(location, resource_type.name)

    warnings.copy_from(validateIdentifier(resource_type.name))

    const existing = seenTypes[resource_type.name]

    if (existing) {
      warnings.add_warning(
        ValidationWarningType.Fatal,
        `${existing.index} and ${location.index} have the same name ('${resource_type.name}')`
      )
    } else if (resource_type.name) {
      seenTypes[resource_type.name] = location
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
    }
  })

  return warnings
}
