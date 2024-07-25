import test from 'ava'

import * as Type from '../../declarations/index.js'
import { is_in_parallel_step } from './index.js'

test('returns false', (t) => {
  t.is(is_in_parallel_step({ do: [] }), false)
})

test('returns true', (t) => {
  const step: Type.InParallelStep = {
    in_parallel: [],
  }

  t.is(is_in_parallel_step(step), true)
})
