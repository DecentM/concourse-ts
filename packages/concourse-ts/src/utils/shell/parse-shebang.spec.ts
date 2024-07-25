import test from 'ava'
import { parse_shebang } from './index.js'

const empty_result = {
  path: '',
  args: [],
}

test('refuses non-shebangs', (t) => {
  t.deepEqual(parse_shebang(''), empty_result)
  t.deepEqual(parse_shebang(' '), empty_result)
  t.deepEqual(parse_shebang('echo test'), empty_result)
})

test('refuses shebangs without path', (t) => {
  t.deepEqual(parse_shebang('#!'), empty_result)

  t.deepEqual(parse_shebang('#! -e'), {
    path: '',
    args: ['-e'],
  })

  t.deepEqual(parse_shebang('#!-e'), {
    path: '-e',
    args: [],
  })
})

test('parses with no arguments', (t) => {
  const result = parse_shebang('#!/bin/sh')

  t.deepEqual(result, {
    path: '/bin/sh',
    args: [],
  })
})

test('parses with arguments', (t) => {
  const result = parse_shebang('#!/bin/sh -e')

  t.deepEqual(result, {
    path: '/bin/sh',
    args: ['-e'],
  })
})
