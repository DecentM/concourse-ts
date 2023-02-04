import {VError} from 'verror'
import {Duration} from '../../declarations/types'

export {Duration}

// https://pkg.go.dev/time#ParseDuration
export const VALID_DURATION_UNITS = ['ns', 'us', 'µs', 'ms', 's', 'm', 'h']

// TODO: ^([0-9]{0,}(ns|us|µs|ms|s|m|h))+$

const create_duration_rx = (valid_units: string[], isGlobal: boolean) => {
  return new RegExp(
    `^([0-9]{0,}(${valid_units.join('|')}))+$`,
    isGlobal ? 'ug' : 'u'
  )
}
// new RegExp(`([0-9]{0,})(${valid_units.join('|')})`, 'gu')

export const is_duration = (
  input: string,
  extra_valid_units: string[] = []
): input is Duration => {
  const valid_units = [...VALID_DURATION_UNITS, ...extra_valid_units]
  const DURATION_RX = create_duration_rx(valid_units, false)

  return DURATION_RX.test(input)
}

/**
 * https://learn.microsoft.com/en-us/javascript/api/@azure/keyvault-certificates/requireatleastone?view=azure-node-latest
 */
type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>
}[keyof T]

export type DurationInput = RequireAtLeastOne<{
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

export const parse_duration = (
  input: Duration,
  extra_valid_units: string[] = []
): DurationInput => {
  if (!is_duration(input)) {
    throw new VError('parse_duration input is not a valid Duration')
  }

  const valid_units = [...VALID_DURATION_UNITS, ...extra_valid_units]
  const DURATION_RX = create_duration_rx(valid_units, true)

  const matches = [...input.matchAll(DURATION_RX)]
  const result: DurationInput = {} as DurationInput

  matches.forEach((match) => {
    const number = Number.parseInt(match[1], 10)

    if (Number.isNaN(number)) {
      return
    }

    switch (match[2]) {
      case 'ns':
        result.nanoseconds = number
        break

      case 'us':
        result.microseconds = number
        break

      case 'ms':
        result.miliseconds = number
        break

      case 's':
        result.seconds = number
        break

      case 'm':
        result.minutes = number
        break

      case 'h':
        result.hours = number
        break
    }
  })

  if (Object.keys(result).length < 1) {
    throw new VError('parse_duration could not parse input', {
      input,
      result,
    })
  }

  return result
}
