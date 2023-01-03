import test from 'ava'
import {deduplicate_by_key} from '.'

test('filters duplicates', (t) => {
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

  t.deepEqual(deduplicate_by_key('key', data), [
    {
      key: '1',
      a: '1'
    }
  ])
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

  t.deepEqual(deduplicate_by_key('key', data), [
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
  ])
})
