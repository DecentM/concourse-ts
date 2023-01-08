import test from 'ava'
import {type_of} from './type-of'

test('null', (t) => {
  t.is(type_of(null), 'null')
})
test('undefined', (t) => {
  t.is(type_of(undefined), 'undefined')
})
test('number', (t) => {
  t.is(type_of(1), 'number')
  t.is(type_of(NaN), 'number')
})
test('string', (t) => {
  t.is(type_of(''), 'string')
  t.is(type_of('a'), 'string')
})
test('boolean', (t) => {
  t.is(type_of(true), 'boolean')
  t.is(type_of(false), 'boolean')
})
test('array', (t) => {
  t.is(type_of([1]), 'array')
})
test('object', (t) => {
  t.is(type_of({}), 'object')
  t.is(type_of(new Number(1)), 'object')
})
test('function', (t) => {
  t.is(
    type_of(() => null),
    'function'
  )
  t.is(
    type_of(function () {
      return null
    }),
    'function'
  )
})
test('symbol', (t) => {
  t.is(type_of(Symbol('a')), 'symbol')
})
test('bigint', (t) => {
  t.is(type_of(BigInt('0001')), 'bigint')
})
