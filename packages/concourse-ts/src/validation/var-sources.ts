// https://github.com/concourse/concourse/blob/6e9795b98254c86ca1c5ebed138d427424eae5f1/atc/configvalidate/validate.go#L420

import * as Type from '../declarations/types'

import {
  Location,
  to_identifier,
  ValidationWarningType,
  WarningStore,
} from '../utils/warning-store'

import {validate_identifier} from './identifier'

export const validate_var_sources = (pipeline: Type.Pipeline): WarningStore => {
  const warnings = new WarningStore()
  const names: Record<string, Location> = {}

  pipeline.var_sources?.forEach((var_source, index) => {
    const location: Location = {section: 'var_sources', index}
    const identifier = to_identifier(location, var_source.name)

    warnings.copy_from(validate_identifier(var_source.name, identifier))

    // Concourse does an internal check here to see if the defined varSourceType
    // exists in its implementation

    switch (var_source.type) {
      case 'vault':
      case 'dummy':
      case 'ssm':
      case 'secretsmanager':
        break

      // Concourse checks for a default here, but our types guarantee that this
      // "default" case will never be called, as long as the user doesn't
      // override our type expectations
      default:
        warnings.add_warning(
          ValidationWarningType.Fatal,
          `this credential manager type is not supported in pipeline yet`
        )
    }

    const existing = names[var_source.name]

    if (existing) {
      warnings.add_warning(
        ValidationWarningType.Fatal,
        `${existing.index} and ${location.index} have the same name ('${var_source.name}')`
      )
    } else if (var_source.name) {
      names[var_source.name] = location
    }

    // Actual credential manager module check here, we just ignore the config
    // option and defer validation of this section to Concourse.
  })

  // TODO: Implement OrderByDependency
  //       https://github.com/concourse/concourse/blob/6e9795b98254c86ca1c5ebed138d427424eae5f1/atc/configvalidate/validate.go#L468
  //       https://github.com/concourse/concourse/blob/8893b0ea2efbe37a72c299f19ac699888b8ce344/atc/config.go#L100

  return warnings
}
