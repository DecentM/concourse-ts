import test from 'ava'

import * as Type from '../../declarations/index.js'
import { Identifier } from './identifier.js'

import { is_get_step } from './index.js'

test('returns false', (t) => {
  t.is(is_get_step({ do: [] }), false)
})

test('returns true', (t) => {
  const step: Type.GetStep = {
    get: '' as Identifier,
  }

  t.is(is_get_step(step), true)
})
