import test from 'ava'
import { is_shebang } from './index.js'

test('finds shebangs', (t) => {
  t.true(is_shebang('#!'))
  t.true(is_shebang('#!/bin/sh'))
  t.true(is_shebang('#!/bin/sh -e'))
  t.true(is_shebang('#!sh'))
  t.true(is_shebang('#!sh -e'))
})

test('no false positives', (t) => {
  t.false(is_shebang(''))
  t.false(is_shebang(' '))
  t.false(is_shebang('sh'))
  t.false(is_shebang('/bin/sh'))
  t.false(is_shebang('sh -e'))
  t.false(is_shebang('/bin/sh -e'))
  t.false(is_shebang('#/bin/sh'))
})
