import test from 'ava'
import { is_var } from './index.js'

test('no false negatives', (t) => {
  t.true(is_var('((test))'))
})

test('no false positives', (t) => {
  t.false(is_var('asd'))
})

test('does not consider a empty secret a secret', (t) => {
  t.false(is_var('(())'))
})
