import test from 'ava'

import { Duration, DurationInput, get_duration } from '.'

test('creates durations with one component', (t) => {
  t.is(get_duration({ minutes: 1 }), '1m' as Duration)
})

test('creates durations with two components', (t) => {
  t.is(get_duration({ minutes: 1, seconds: 5 }), '1m5s' as Duration)
})

test('creates durations with three components', (t) => {
  t.is(
    get_duration({ minutes: 1, seconds: 15, microseconds: 1 }),
    '1m15s1us' as Duration
  )
})

test('creates durations with all components in the right order', (t) => {
  t.is(
    get_duration({
      minutes: 1,
      seconds: 15,
      microseconds: 1,
      hours: 6,
      milliseconds: 23,
      nanoseconds: 10,
    }),
    '6h1m15s23ms1us10ns' as Duration
  )
})

test('throws when invalid durations are created', (t) => {
  t.throws(() => get_duration({ hours: -1 }), {
    any: true,
    message:
      'Duration value must be positive, but got -1. Change this to a positive number, or remove the duration component.',
  })
})

test('throws when an empty object is passed', (t) => {
  t.throws(() => get_duration({} as unknown as DurationInput), {
    any: true,
    message: 'Result "" is not a valid Duration.',
  })
})

test('throws when undefined is passed', (t) => {
  t.throws(() => get_duration(undefined as unknown as DurationInput), {
    any: true,
    message: 'Result "" is not a valid Duration.',
  })
})
