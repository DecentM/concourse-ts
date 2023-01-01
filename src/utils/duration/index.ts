import {Duration} from '~/declarations/types'

export {Duration}

// https://pkg.go.dev/time#ParseDuration
export const VALID_DURATION_UNITS = ['ns', 'us', 'µs', 'ms', 's', 'm', 'h']

export const is_duration = (
  input: string,
  extra_valid_units: string[] = []
): input is Duration => {
  const valid_units = [...VALID_DURATION_UNITS, ...extra_valid_units]
  const DURATION_RX = new RegExp(`^[0-9]{0,}(${valid_units.join('|')})$`, 'gu')

  return !!DURATION_RX.exec(input)
}

export const get_duration = (
  input: string,
  fallback: Duration = '1m' as Duration
): Duration => {
  if (!is_duration(input)) {
    return fallback
  }

  return input
}
