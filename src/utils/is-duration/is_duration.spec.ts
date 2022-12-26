import test from 'ava'
import {is_duration, VALID_DURATION_UNITS} from '.'

VALID_DURATION_UNITS.forEach((unit, index) => {
  test(`is_duration > should accept ${unit}`, (t) => {
    const input = `${index}${unit}`

    t.true(is_duration(input))
  })
})

const BOGUS_UNITS = ['km', 'mi', 'g', 'd']

BOGUS_UNITS.forEach((unit, index) => {
  test(`is_duration > should reject ${unit}`, (t) => {
    const input = `${index}${unit}`
    const result = is_duration(input)

    if (result) console.log({input})

    t.false(is_duration(input))
  })
})

test('is_duration > undefined', (t) => {
  t.false(is_duration(undefined as string))
})

test('is_duration > null', (t) => {
  t.false(is_duration(null as string))
})
