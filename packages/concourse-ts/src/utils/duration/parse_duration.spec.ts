import test from 'ava'

import {Duration, parse_duration} from '.'

test('parses durations', (t) => {
  const result = parse_duration('2h5m' as Duration)

  t.deepEqual(result, {hours: 2, minutes: 5})
})
