import test from 'ava'

import * as Type from '../../declarations'
import {Identifier} from '../identifier'

import {is_task_step} from '.'

test('returns false', (t) => {
  t.is(is_task_step({do: []}), false)
})

test('returns true', (t) => {
  const step: Type.TaskStep = {
    task: '' as Identifier,
  }

  t.is(is_task_step(step), true)
})
