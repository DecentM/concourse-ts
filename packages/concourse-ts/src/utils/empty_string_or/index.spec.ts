import test from 'ava'

import { empty_string_or } from './index.js'

const value = () => 'my_value'

test('returns empty string for undefined', (t) => {
  t.is(empty_string_or(undefined, value), '')
})

test('returns empty string for null', (t) => {
  t.is(empty_string_or(null, value), '')
})

test('returns empty string for empty array', (t) => {
  t.is(empty_string_or([], value), '')
})

test('returns value for non-empty array', (t) => {
  t.is(empty_string_or(['a'], value), value())
})

test('returns value for everything else', (t) => {
  t.is(empty_string_or(true, value), value())
  t.is(empty_string_or(false, value), value())
  t.is(empty_string_or(Symbol('a'), value), value())
})
