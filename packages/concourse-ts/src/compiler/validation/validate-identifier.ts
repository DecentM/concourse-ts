// https://github.com/concourse/concourse/blob/ef6c441daf6eef75933cf14d5492e616f7442693/atc/configwarning.go#L18

import {ValidationWarningType, WarningStore} from '../../utils/warning-store'

const last = (input: string[]) => {
  return input[input.length - 1]
}

export const validate_identifier = (
  identifier: string,
  ...context: string[]
): WarningStore => {
  const warnings = new WarningStore()

  if (!identifier) {
    return warnings.add_warning(
      ValidationWarningType.Fatal,
      `${context.join('')}: identifier cannot be an empty string`
    )
  }

  const contextLen = context.length
  const lastContext = last(context)

  if (
    contextLen >= 2 &&
    (lastContext.includes('set_pipeline') ||
      (lastContext.includes('task') && context[contextLen - 2] === '.across'))
  ) {
    return warnings
  }

  const validIdentifiers =
    /^[\p{Ll}\p{Lt}\p{Lm}\p{Lo}][\p{Ll}\p{Lt}\p{Lm}\p{Lo}\d\-_.]*$/gu

  const startsWithLetter = /^[^\p{Ll}\p{Lt}\p{Lm}\p{Lo}]/gu
  const invalidCharacter = /([^\p{Ll}\p{Lt}\p{Lm}\p{Lo}\d\-_.])/gu

  if (!validIdentifiers.test(identifier)) {
    let reason = ''

    if (startsWithLetter.test(identifier)) {
      reason = 'must start with a lowercase letter'
    } else {
      const invalidMatch = invalidCharacter.exec(identifier)
      reason = `illegal character '${invalidMatch[0]}'`
    }

    return warnings.add_warning(
      ValidationWarningType.Fatal,
      `${context.join(
        ''
      )}: "${identifier}" is not a valid identifier: ${reason}`
    )
  }

  return warnings
}
