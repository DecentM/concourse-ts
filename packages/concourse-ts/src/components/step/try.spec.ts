import test from 'ava'
import {LoadVarStep, Resource, ResourceType, Task} from '..'

import {TryStep} from './try'

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
  tags: undefined,
}

const default_try_step = {
  ...default_step,
  try: undefined,
}

test.beforeEach(() => {
  TryStep.customise((ts) => {
    ts.add_tag('static')
  })
})

test('runs static customiser', (t) => {
  const ts = new TryStep('a')

  t.deepEqual(ts.serialise(), default_try_step)
})

test('runs instance customiser', (t) => {
  const ts = new TryStep('a', (a) => {
    a.add_tag('instance')
  })

  t.deepEqual(ts.serialise(), {
    ...default_try_step,
    tags: ['static', 'instance'],
  })
})

test('collects resources', (t) => {
  const ts = new TryStep('a')

  const r = new Resource(
    'r',
    new ResourceType('rt', (rt) => {
      rt.set_type('registry-image')
    })
  )

  const result0 = ts.get_resources()

  t.is(result0.length, 0)
  t.deepEqual(result0, [])

  ts.set_try(r.as_get_step())

  const result = ts.get_resources()

  t.is(result.length, 1)
  t.deepEqual(result, [r])
})

test('collects task steps', (t) => {
  const ts = new TryStep('a')

  const task = new Task('t', (t) => {
    t.platform = 'linux'
  })

  const task_step = task.as_task_step()

  ts.set_try(task_step)

  const result = ts.get_task_steps()

  t.is(result.length, 1)
  t.deepEqual(result, [task_step])
})

test('stores step', (t) => {
  const ts = new TryStep('ts')

  ts.set_try(new LoadVarStep('lvs'))

  t.deepEqual(ts.serialise(), {
    ...default_try_step,
    try: default_load_var_step,
  })
})
