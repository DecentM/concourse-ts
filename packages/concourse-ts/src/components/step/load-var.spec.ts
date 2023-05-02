import test from 'ava'

import {LoadVarStep} from './load-var'
import {default_load_var_step} from './test-data/default-steps'

test('runs static customiser', (t) => {
  LoadVarStep.customise((lvs) => {
    lvs.attempts = 2
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
    a.add_tag('instance')
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
