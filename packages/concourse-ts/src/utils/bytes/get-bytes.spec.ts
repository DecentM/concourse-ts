import test from 'ava'
import { get_bytes } from './index.js'

test('returns zero with no input', (t) => {
  t.is(get_bytes({}), 0)
})

test('bytes', (t) => {
  t.is(get_bytes({ b: 1 }), 1)
})

test('kilobytes', (t) => {
  t.is(get_bytes({ kb: 1 }), 1_000)
})

test('megabytes', (t) => {
  t.is(get_bytes({ mb: 1 }), 1_000_000)
})

test('gigabytes', (t) => {
  t.is(get_bytes({ gb: 1 }), 1_000_000_000)
})

test('addition', (t) => {
  t.is(get_bytes({ b: 2, kb: 44, mb: 1233, gb: 2 }), 3_233_044_002)
})
