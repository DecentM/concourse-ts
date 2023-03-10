import test from 'ava'
import {deduplicate_by_key} from '.'

const noop = () => ''

test('returns empty array for non-arrays', (t) => {
  t.deepEqual(deduplicate_by_key(noop, null as unknown as string[]), [])
})

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

  t.deepEqual(
    deduplicate_by_key((item) => item.key, data),
    [
      {
        key: '1',
        a: '1',
      },
    ]
  )
})

test('no false positives', (t) => {
  t.deepEqual(
    deduplicate_by_key(
      (item) => item.key ?? '-1',
      [
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
    ),
    [
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
  )
})
