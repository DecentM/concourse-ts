import test from 'ava'
import { deduplicate_by_identity } from './index.js'

test('returns empty array for non-arrays', (t) => {
  t.deepEqual(deduplicate_by_identity(null as unknown as string[]), [])
})

test('filters duplicates', (t) => {
  const a = { key: '1', a: '1' }
  const b = { key: '1', a: '2' }

  const data = [a, b, b]

  t.deepEqual(deduplicate_by_identity(data), [a, b])
})

test('no false positives', (t) => {
  const a = {
    key: '1',
    a: '1',
  }

  const b = {
    key: '2',
    b: '1',
  }

  const c = {
    asd: '1',
  }

  t.deepEqual(deduplicate_by_identity([a, b, c]), [a, b, c])
})
