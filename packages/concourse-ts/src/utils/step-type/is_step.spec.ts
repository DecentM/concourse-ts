import test from 'ava'

import * as Type from '../../declarations/index.js'
import { is_step } from './index.js'

test('returns false', (t) => {
  t.is(is_step({ hello: 'world' }), false)
})

test('returns true', (t) => {
  const step: Type.Step = {
    do: [],
  }

  t.is(is_step(step), true)
})
