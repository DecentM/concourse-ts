import test from 'ava'

import * as Type from '../../declarations'
import {is_try_step} from '.'

test('returns false', (t) => {
  t.is(is_try_step({in_parallel: []}), false)
})

test('returns true', (t) => {
  const ds: Type.TryStep = {
    try: {do: []},
  }

  t.is(is_try_step(ds), true)
})
