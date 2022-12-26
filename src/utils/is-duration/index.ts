import {Duration} from '~/declarations/types'

// https://pkg.go.dev/time#ParseDuration
export const VALID_DURATION_UNITS = ['ns', 'us', 'µs', 'ms', 's', 'm', 'h']

export const is_duration = (input: string): input is Duration => {
  const DURATION_RX = /^[0-9]{0,}(ns|us|µs|ms|s|m|h)$/gu

  return !!DURATION_RX.exec(input)
}
