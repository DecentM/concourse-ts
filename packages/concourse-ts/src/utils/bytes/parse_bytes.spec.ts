import test from 'ava'
import {parse_bytes} from '.'

test('parses single bytes', (t) => {
  t.deepEqual(parse_bytes(1), {b: 1})
})

test('parses kb', (t) => {
  t.deepEqual(parse_bytes(1_000), {kb: 1})
})

test('parses mb', (t) => {
  t.deepEqual(parse_bytes(1_000_000), {mb: 1})
})

test('parses gb', (t) => {
  t.deepEqual(parse_bytes(1_000_000_000), {gb: 1})
})

test('handles remainders right', (t) => {
  t.deepEqual(parse_bytes(2_231_883_861), {
    gb: 2,
    mb: 231,
    kb: 883,
    b: 861,
  })
})
