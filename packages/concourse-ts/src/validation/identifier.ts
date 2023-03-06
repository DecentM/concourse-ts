// https://github.com/concourse/concourse/blob/ef6c441daf6eef75933cf14d5492e616f7442693/atc/configwarning.go#L18

import {ValidationWarningType, WarningStore} from '../utils/warning-store'

export const validate_identifier = (
  identifier: string,
  ...context: string[]
): WarningStore => {
  const warnings = new WarningStore()
  const context_string = context.length ? `${context.join('')}: ` : ''

  if (!identifier) {
    return warnings.add_warning(
      ValidationWarningType.Fatal,
      `${context_string}identifier cannot be an empty string`
    )
  }

  const last_context = context[context.length - 1]

  // Across steps may have variable interpolation, so Concourse accepts any name
  // TODO: We can check this more strictly than Concourse does
  if (
    context.length >= 2 &&
    (last_context.includes('set_pipeline') ||
      (last_context.includes('task') &&
        context[context.length - 2] === '.across'))
  ) {
    return warnings
  }

  const validate_identifiers =
    /^[\p{Ll}\p{Lt}\p{Lm}\p{Lo}][\p{Ll}\p{Lt}\p{Lm}\p{Lo}\d\-_.]*$/gu

  const starts_with_letter = /^[^\p{Ll}\p{Lt}\p{Lm}\p{Lo}]/gu
  const invalid_character = /([^\p{Ll}\p{Lt}\p{Lm}\p{Lo}\d\-_.])/gu

  if (!validate_identifiers.test(identifier)) {
    let reason = ''

    if (starts_with_letter.test(identifier)) {
      reason = 'must start with a lowercase letter'
    } else {
      const invalid_match = invalid_character.exec(identifier)
      reason = `illegal character '${invalid_match[0]}'`
    }

    return warnings.add_warning(
      ValidationWarningType.Fatal,
      `${context_string}"${identifier}" is not a valid identifier: ${reason}`
    )
  }

  return warnings
}
