import test from 'ava'
import { has_duplicates_by_identity } from './index.js'

test('finds duplicates', (t) => {
  const a = {
    key: '1',
    a: '1',
  }

  const b = {
    key: '1',
    a: '2',
  }

  t.true(has_duplicates_by_identity([a, a, b]))
  t.true(has_duplicates_by_identity<number>([1, 1, 2]))
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

  t.false(has_duplicates_by_identity([a, b, c]))
  t.false(has_duplicates_by_identity([{}, {}]))
})
