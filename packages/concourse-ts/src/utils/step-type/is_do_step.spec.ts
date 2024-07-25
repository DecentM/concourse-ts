import test from 'ava'

import * as Type from '../../declarations/index.js'
import { is_do_step } from './index.js'

test('returns false', (t) => {
  t.is(is_do_step({ in_parallel: [] }), false)
})

test('returns true', (t) => {
  const ds: Type.DoStep = {
    do: [],
  }

  t.is(is_do_step(ds), true)
})
