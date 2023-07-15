import test from 'ava'

import * as Type from '../../declarations'
import {Identifier} from '../identifier'

import {is_set_pipeline_step} from '.'

test('returns false', (t) => {
  t.is(is_set_pipeline_step({do: []}), false)
})

test('returns true', (t) => {
  const step: Type.SetPipelineStep = {
    file: '',
    set_pipeline: '' as Identifier,
  }

  t.is(is_set_pipeline_step(step), true)
})
