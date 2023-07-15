import test from 'ava'

import * as Type from '../../declarations'
import {Identifier} from '../identifier'

import {is_load_var_step} from '.'

test('returns false', (t) => {
  t.is(is_load_var_step({do: []}), false)
})

test('returns true', (t) => {
  const step: Type.LoadVarStep = {
    file: '',
    load_var: '' as Identifier,
  }

  t.is(is_load_var_step(step), true)
})
