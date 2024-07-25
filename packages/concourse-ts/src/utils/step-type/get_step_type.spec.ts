import test from 'ava'

import * as Type from '../../declarations/index.js'
import { get_step_type } from './index.js'

test('returns null for non-step object', (t) => {
  t.is(get_step_type({}), null)
})

test('returns null for non-object', (t) => {
  t.is(get_step_type(9), null)
})

test('returns do_step', (t) => {
  const ds: Type.DoStep = {
    do: [],
  }

  t.is(get_step_type(ds), 'do')
})
