import test from 'ava'

import { get_var, is_var } from '../../utils/index.js'

import { LoadVarStep } from './load-var.js'
import { default_load_var_step } from './test-data/default-steps.js'

test('runs static customiser', (t) => {
  LoadVarStep.customise((lvs) => {
    lvs.set_attempts(2)
  })

  const lvs = new LoadVarStep('a')

  t.deepEqual(lvs.serialise(), {
    ...default_load_var_step,
    attempts: 2,
  })

  LoadVarStep.customise(() => null)
})

test('runs instance customiser', (t) => {
  const lvs = new LoadVarStep('a', (a) => {
    a.add_tags('instance')
  })

  t.deepEqual(lvs.serialise(), {
    ...default_load_var_step,
    tags: ['instance'],
  })
})

test('collects resources', (t) => {
  const lvs = new LoadVarStep('a')

  const result = lvs.get_resources()

  t.is(result.length, 0)
  t.deepEqual(result, [])
})

test('collects task steps', (t) => {
  const lvs = new LoadVarStep('a')

  const result = lvs.get_task_steps()

  t.is(result.length, 0)
  t.deepEqual(result, [])
})

test('exposes resulting var', (t) => {
  const lvs = new LoadVarStep('a')
  lvs.set_load_var('a')

  t.is(lvs.var, get_var('.:a'))
  t.true(is_var(lvs.var))
})
