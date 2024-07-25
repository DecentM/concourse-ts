import test from 'ava'
import { has_duplicates_by_key } from './index.js'

test('finds duplicates', (t) => {
  const data = [
    {
      key: '1',
      a: '1',
    },
    {
      key: '1',
      a: '2',
    },
  ]

  t.true(has_duplicates_by_key((item) => item.key, data))
})

test('no false positives', (t) => {
  const data = [
    {
      key: '1',
      a: '1',
    },
    {
      key: '2',
      b: '1',
    },
    {
      asd: '1',
    },
  ]

  t.false(has_duplicates_by_key((item) => item.key ?? '-1', data))
})
