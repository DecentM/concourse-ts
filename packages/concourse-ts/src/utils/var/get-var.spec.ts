import test from 'ava'
import { get_var, Var } from './index.js'

test('wraps input string', (t) => {
  const result = get_var('my-secret')

  t.is(result, '((my-secret))' as Var)
})

test('does not double-wrap', (t) => {
  const result = get_var('((my-secret))')

  t.is(result, '((my-secret))' as Var)
})
