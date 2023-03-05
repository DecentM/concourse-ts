import test from 'ava'
import {is_duration} from '.'

const VALID_DURATION_UNITS = ['ns', 'us', 'µs', 'ms', 's', 'm', 'h']

VALID_DURATION_UNITS.forEach((unit, index) => {
  test(`accepts ${unit}`, (t) => {
    const input = `${index}${unit}`

    t.true(is_duration(input))
  })
})

const BOGUS_UNITS = ['km', 'mi', 'g', 'd']

BOGUS_UNITS.forEach((unit, index) => {
  test(`rejects ${unit}`, (t) => {
    const input = `${index}${unit}`

    t.false(is_duration(input))
  })
})

test('refuses undefined', (t) => {
  t.false(is_duration(undefined as unknown as string))
})

test('refuses null', (t) => {
  t.false(is_duration(null as unknown as string))
})

test('refuses "never" by default', (t) => {
  t.false(is_duration('never'))
})

test('accepts "never" if the valid_units are overwritten', (t) => {
  t.true(is_duration('never', ['never']))
})

test('accepts concatenated duration values', (t) => {
  t.true(is_duration('2h23m'))
})

test('rejects invalid concatenated duration values', (t) => {
  t.false(is_duration('2d23m'))
})
