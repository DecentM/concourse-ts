import test from 'ava'

import * as Type from '../../declarations'
import {Identifier} from '../identifier'

import {is_put_step} from '.'

test('returns false', (t) => {
  t.is(is_put_step({do: []}), false)
})

test('returns true', (t) => {
  const step: Type.PutStep = {
    put: '' as Identifier,
  }

  t.is(is_put_step(step), true)
})
