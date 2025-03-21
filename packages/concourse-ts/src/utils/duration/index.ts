import VError from 'verror'
import { type_of } from '../type-of/index.js'

/**
 * Related: {@link DurationInput}
 */
export type Duration = string & { __type: 'Duration' }

// https://pkg.go.dev/time#ParseDuration
const VALID_DURATION_UNITS = ['ns', 'us', 'µs', 'ms', 's', 'm', 'h']

export const is_duration = (
  input: string,
  extra_valid_units: string[] = []
): input is Duration => {
  if (
    input === 'never' &&
    [...VALID_DURATION_UNITS, ...extra_valid_units].includes('never')
  ) {
    return true
  }

  try {
    parse_duration(input, extra_valid_units)
    return true
  } catch {
    return false
  }
}

/**
 * https://learn.microsoft.com/en-us/javascript/api/@azure/keyvault-certificates/requireatleastone?view=azure-node-latest
 */
type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>
}[keyof T]

/**
 * https://pkg.go.dev/time#ParseDuration
 */
export type DurationInput = RequireAtLeastOne<{
  nanoseconds?: number
  microseconds?: number
  milliseconds?: number
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

  if (typeof input.milliseconds !== 'undefined') {
    result += `${input.milliseconds}ms`
  }

  if (typeof input.microseconds !== 'undefined') {
    result += `${input.microseconds}us`
  }

  if (typeof input.nanoseconds !== 'undefined') {
    result += `${input.nanoseconds}ns`
  }

  if (!is_duration(result)) {
    throw new VError(`Result "${result}" is not a valid Duration.`)
  }

  return result
}

type ParseNode = {
  unit: string
  value: number
}

export const parse_duration = (input: string, extra_valid_units: string[] = []) => {
  if (type_of(input) !== 'string') {
    throw new VError(
      `value of type "${type_of(input)}" cannot be parsed as duration`
    )
  }

  if (!input) {
    throw new VError(`an empty string cannot be parsed as duration`)
  }

  const tokens = []
  let cursor = 0

  while (cursor < input.length) {
    let token = ''

    while (/\d/u.exec(input[cursor]) && cursor < input.length) {
      token += input[cursor]
      cursor++
    }

    if (token) {
      tokens.push(token)
      continue
    }

    while (!/\d/u.exec(input[cursor]) && cursor < input.length) {
      token += input[cursor]
      cursor++
    }

    if (token) {
      tokens.push(token)
      cursor--
    }

    cursor++
  }

  cursor = 0

  const nodes: ParseNode[] = []
  let temp: ParseNode = {
    unit: '',
    value: 0,
  }

  while (cursor < tokens.length) {
    const token = tokens[cursor]
    const number = Number.parseInt(token, 10)

    if (Number.isNaN(number)) {
      temp.unit = token
    } else {
      temp.value = number
    }

    if (temp.unit && type_of(temp.value) === 'number') {
      nodes.push(temp)

      temp = {
        unit: '',
        value: 0,
      }
    }

    cursor++
  }

  const result: Partial<DurationInput> = {}

  nodes.forEach((node) => {
    if (![...extra_valid_units, ...VALID_DURATION_UNITS].includes(node.unit)) {
      throw new VError(`"${node.unit}" is not a valid duration unit`)
    }

    switch (node.unit) {
      case 'ns':
        result.nanoseconds = node.value
        break

      case 'µs':
      case 'us':
        result.microseconds = node.value
        break

      case 'ms':
        result.milliseconds = node.value
        break

      case 's':
        result.seconds = node.value
        break

      case 'm':
        result.minutes = node.value
        break

      case 'h':
        result.hours = node.value
        break
    }
  })

  return result
}
