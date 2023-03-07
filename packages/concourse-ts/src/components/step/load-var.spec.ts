import test from 'ava'

import {LoadVarStep} from './load-var'

const default_step = {
  attempts: undefined,
  ensure: undefined,
  on_abort: undefined,
  on_error: undefined,
  on_failure: undefined,
  on_success: undefined,
  tags: ['static'],
  timeout: undefined,
}

const default_load_var_step = {
  ...default_step,
  file: undefined,
  format: undefined,
  load_var: undefined,
  reveal: undefined,
}

test.beforeEach(() => {
  LoadVarStep.customise((lvs) => {
    lvs.add_tag('static')
  })
})

test('runs static customiser', (t) => {
  const lvs = new LoadVarStep('a')

  t.deepEqual(lvs.serialise(), default_load_var_step)
})

test('runs instance customiser', (t) => {
  const lvs = new LoadVarStep('a', (a) => {
    a.add_tag('instance')
  })

  t.deepEqual(lvs.serialise(), {
    ...default_load_var_step,
    tags: ['static', 'instance'],
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
