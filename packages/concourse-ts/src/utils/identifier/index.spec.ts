import test from 'ava'

import { get_identifier, Identifier } from '.'

test('converts valid strings', (t) => {
  t.is(get_identifier('a'), 'a' as Identifier)
})

test('throws for invalid strings', (t) => {
  t.throws(
    () => {
      get_identifier('A')
    },
    {
      any: true,
      message: '"A" is not a valid identifier: must start with a lowercase letter',
    }
  )
})

test('autocorrects bad identifiers', (t) => {
  t.is(get_identifier('test!'), 'test_' as Identifier)
})
