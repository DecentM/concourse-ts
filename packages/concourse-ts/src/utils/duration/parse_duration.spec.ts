import test from 'ava'

import { Duration, parse_duration } from './index.js'

test('parses durations', (t) => {
  const result = parse_duration('2h5m8s6ms1us9ns' as Duration, ['h', 'm'])

  t.deepEqual(result, {
    hours: 2,
    minutes: 5,
    seconds: 8,
    milliseconds: 6,
    microseconds: 1,
    nanoseconds: 9,
  })
})

test('throws for empty strings and non-strings', (t) => {
  t.throws(() => parse_duration(''), {
    any: true,
    message: 'an empty string cannot be parsed as duration',
  })

  t.throws(() => parse_duration({} as string), {
    any: true,
    message: 'value of type "object" cannot be parsed as duration',
  })
})

test('throws for invalid units', (t) => {
  t.throws(() => parse_duration('2h4w'), {
    any: true,
    message: '"w" is not a valid duration unit',
  })
})
