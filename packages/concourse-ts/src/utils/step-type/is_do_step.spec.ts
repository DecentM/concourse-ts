import test from 'ava'

import * as Type from '../../declarations'
import {is_do_step} from '.'

test('returns false', (t) => {
  t.is(is_do_step({in_parallel: []}), false)
})

test('returns true', (t) => {
  const ds: Type.DoStep = {
    do: [],
  }

  t.is(is_do_step(ds), true)
})
