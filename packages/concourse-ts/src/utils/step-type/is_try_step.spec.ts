import test from 'ava'

import * as Type from '../../declarations/index.js'
import { is_try_step } from './index.js'

test('returns false', (t) => {
  t.is(is_try_step({ in_parallel: [] }), false)
})

test('returns true', (t) => {
  const ds: Type.TryStep = {
    try: { do: [] },
  }

  t.is(is_try_step(ds), true)
})
