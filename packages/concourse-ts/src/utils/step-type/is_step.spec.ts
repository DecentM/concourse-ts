import test from 'ava'

import * as Type from '../../declarations'
import {is_step} from '.'

test('returns false', (t) => {
  t.is(is_step({hello: 'world'}), false)
})

test('returns true', (t) => {
  const step: Type.Step = {
    do: [],
  }

  t.is(is_step(step), true)
})
