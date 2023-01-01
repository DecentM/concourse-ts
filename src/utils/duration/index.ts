import {VError} from 'verror'
import {Duration} from '~/declarations/types'

export {Duration}

// https://pkg.go.dev/time#ParseDuration
export const VALID_DURATION_UNITS = ['ns', 'us', 'µs', 'ms', 's', 'm', 'h']

export const is_duration = (
  input: string,
  extra_valid_units: string[] = []
): input is Duration => {
  const valid_units = [...VALID_DURATION_UNITS, ...extra_valid_units]
  const DURATION_RX = new RegExp(
    `^([0-9]{0,}(${valid_units.join('|')}))+$`,
    'gu'
  )

  return !!DURATION_RX.exec(input)
}

export const is_never = (input: Duration): input is never => {
  return input === 'never'
}

/**
 * https://learn.microsoft.com/en-us/javascript/api/@azure/keyvault-certificates/requireatleastone?view=azure-node-latest
 */
type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>
}[keyof T]

type DurationInput = RequireAtLeastOne<{
  nanoseconds?: number
  microseconds?: number
  miliseconds?: number
  seconds?: number
  minutes?: number
  hours?: number
}>

export const get_duration = (input: DurationInput | 'never'): Duration => {
  if (input === 'never') {
    return 'never' as Duration
  }

  let result = ''

  if (typeof input !== 'object') {
    input = {} as DurationInput
  }

  Object.values(input).forEach((value) => {
    if (value < 0) {
      throw new VError(
        `Duration value must be positive, but got ${value}. Change this to a positive number, or remove the duration component.`
      )
    }
  })

  if (typeof input.hours !== 'undefined') {
    result += `${input.hours}h`
  }

  if (typeof input.minutes !== 'undefined') {
    result += `${input.minutes}m`
  }

  if (typeof input.seconds !== 'undefined') {
    result += `${input.seconds}s`
  }

  if (typeof input.miliseconds !== 'undefined') {
    result += `${input.miliseconds}ms`
  }

  if (typeof input.microseconds !== 'undefined') {
    result += `${input.microseconds}us`
  }

  if (typeof input.nanoseconds !== 'undefined') {
    result += `${input.nanoseconds}ns`
  }

  if (!is_duration(result)) {
    throw new VError(
      `Result "${result}" is not a valid Duration. If you used the "as" keyword while using get_duration, remove it. Otherwise, this is probably a concourse-ts internal error, please report!`
    )
  }

  return result
}
