/**
 * Branded type for vars
 *
 * https://concourse-ci.org/vars.html#var-syntax
 *
 * {@link is_var}
 *
 * {@link get_var}
 */
export type Var = string & {__type: 'Var'}

/**
 * Returns if the input is a valid variable.
 *
 * https://concourse-ci.org/vars.html#var-syntax
 *
 * Example:
 * ```typescript
 * const name = '((my_secret))'
 *    // ^? string
 *
 * if (!is_var(name)) {
 *   return
 * }
 *
 * console.log(name)
 *          // ^? Var
 * ```
 *
 * {@link get_var}
 *
 * {@link Var}
 *
 * @param {string} input The potential Var to check
 * @returns {bool} Type guard for valid vars, using branded types.
 *
 */
export const is_var = (input: string): input is Var => {
  return input.startsWith('((') && input.endsWith('))') && input.length > 4
}

/**
 * Coerces the input into a Var. If the input is a valid Var, returns the input
 * as-is. Otherwise, wraps the input string in `(())` to make it a valid var.
 *
 * https://concourse-ci.org/vars.html#var-syntax
 *
 * {@link is_identifier}
 *
 * {@link Var}
 *
 * @param {string} input
 * @returns {Var}
 */
export const get_var = (input: string): Var => {
  if (is_var(input)) {
    return input
  }

  return `((${input}))` as Var
}
