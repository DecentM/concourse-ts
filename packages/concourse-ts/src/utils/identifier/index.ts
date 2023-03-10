import {VError} from 'verror'

import {validate_identifier} from '../../validation/identifier'

/**
 * https://concourse-ci.org/config-basics.html#schema.identifier
 *
 * {@link is_identifier}
 *
 * {@link get_identifier}
 */
export type Identifier = string & {__type: 'Identifier'}

/**
 * Returns if the input is a valid Identifier, using the compiler's validator.
 *
 * https://concourse-ci.org/config-basics.html#schema.identifier
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
export const is_identifier = (input: string): input is Identifier => {
  const warnings = validate_identifier(input)

  if (warnings.has_fatal()) {
    return false
  }

  return true
}

/**
 * Returns the input string if it's a valid identifier, converted to the
 * Identifier type. Throws if the passed input fails Identifier validation.
 *
 * https://concourse-ci.org/config-basics.html#schema.identifier
 *
 * {@link is_identifier}
 *
 * @param {string} input
 * @returns {Identifier} The input
 * @throws {VError}
 */
export const get_identifier = (input: string): Identifier => {
  if (is_identifier(input)) {
    return input
  }

  const warnings = validate_identifier(input)

  throw new VError(
    warnings
      .get_warnings()
      .map((warning) => warning.messages.join(', '))
      .join(',\n')
  )
}
