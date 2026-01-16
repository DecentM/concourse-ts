import VError from 'verror'

import { validate_identifier } from '../../validation/identifier.js'
import { type_of } from '../type-of/index.js'

/**
 * https://concourse-ci.org/docs/config-basics/#identifier-schema
 *
 * {@link is_identifier}
 *
 * {@link get_identifier}
 */
export type Identifier = string & { __type: 'Identifier' }

/**
 * Returns if the input is a valid Identifier, using the compiler's validator.
 *
 * https://concourse-ci.org/docs/config-basics/#identifier-schema
 *
 * Example:
 * ```typescript
 * const name = 'my-name'
 *    // ^? string
 *
 * new Job(name) // Compilation error
 *
 * if (!is_identifier(name)) {
 *   return
 * }
 *
 * new Job(name) // No error
 *      // ^? Identifier
 * ```
 *
 * {@link get_identifier}
 *
 * {@link Identifier}
 *
 * @param {string} input The potential Identifier to check
 * @returns {bool} Type guard for valid identifiers, using branded types.
 *
 */
export const is_identifier = <IdentifierType extends Identifier = Identifier>(
  input: unknown
): input is IdentifierType => {
  if (type_of(input) !== 'string') {
    return false
  }

  const warnings = validate_identifier(input as string)

  if (warnings.has_fatal()) {
    return false
  }

  return true
}

/**
 * Returns the input string if it's a valid identifier, converted to the
 * Identifier type. Throws if the passed input fails Identifier validation.
 *
 * https://concourse-ci.org/docs/config-basics/#identifier-schema
 *
 * {@link is_identifier}
 *
 * @param {string} input
 * @returns {Identifier} The input
 * @throws {VError}
 */
export const get_identifier = <IdentifierType extends Identifier = Identifier>(
  input: string
): IdentifierType => {
  if (input === '') {
    throw new VError('identifier cannot be an empty string')
  }

  if (!input) {
    return undefined
  }

  if (is_identifier<IdentifierType>(input)) {
    return input
  }

  const identifier = input.replace(/[^\w .-]+/gmu, '_')

  if (is_identifier<IdentifierType>(identifier)) {
    return identifier
  }

  const warnings = validate_identifier(input)

  throw new VError(
    warnings
      .get_warnings()
      .map((warning) => warning.messages.join(', '))
      .join(',\n')
  )
}
