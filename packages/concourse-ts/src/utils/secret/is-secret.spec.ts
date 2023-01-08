import test from 'ava'
import {is_secret} from '.'

test('no false negatives', (t) => {
  t.true(is_secret('((test))'))
})

test('no false positives', (t) => {
  t.false(is_secret('asd'))
})

test('does not consider a empty secret a secret', (t) => {
  t.false(is_secret('(())'))
})
