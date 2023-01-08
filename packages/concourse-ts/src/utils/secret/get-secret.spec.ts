import test from 'ava'
import {get_secret, Secret} from '.'

test('wraps input string', (t) => {
  const result = get_secret('my-secret')

  t.is(result, '((my-secret))' as Secret)
})

test('does not double-wrap', (t) => {
  const result = get_secret('((my-secret))')

  t.is(result, '((my-secret))' as Secret)
})
