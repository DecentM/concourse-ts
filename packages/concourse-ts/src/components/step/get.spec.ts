import test from 'ava'
import {Job, Resource, ResourceType} from '..'

import {GetStep} from './get'

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

const default_get_step = {
  ...default_step,
  get: undefined,
  params: undefined,
  passed: undefined,
  trigger: undefined,
  version: undefined,
  resource: undefined,
}

test.beforeEach(() => {
  GetStep.customise((ds) => {
    ds.add_tag('static')
  })
})

test('runs static customiser', (t) => {
  const gs = new GetStep('a')

  t.deepEqual(gs.serialise(), default_get_step)
})

test('runs instance customiser', (t) => {
  const gs = new GetStep('a', (a) => {
    a.add_tag('instance')
  })

  t.deepEqual(gs.serialise(), {
    ...default_get_step,
    tags: ['static', 'instance'],
  })
})

test('collects resources', (t) => {
  const gs = new GetStep('a')

  const r = new Resource(
    'r',
    new ResourceType('rt', (rt) => {
      rt.set_type('registry-image')
    })
  )

  const result0 = gs.get_resources()

  t.is(result0.length, 0)
  t.deepEqual(result0, [])

  gs.set_get(r)

  const result = gs.get_resources()

  t.is(result.length, 1)
  t.deepEqual(result, [r])
})

test('collects task steps', (t) => {
  const gs = new GetStep('a')

  const result = gs.get_task_steps()

  t.is(result.length, 0)
  t.deepEqual(result, [])
})

test('stores passed', (t) => {
  const gs = new GetStep('gs')
  const j = new Job('j')

  gs.add_passed(j)

  t.deepEqual(gs.serialise(), {
    ...default_get_step,
    passed: ['j'],
  })
})

test('stores params', (t) => {
  const gs = new GetStep('gs')

  gs.set_params({
    my_param: '1',
  })

  t.deepEqual(gs.serialise(), {
    ...default_get_step,
    params: {
      my_param: '1',
    },
  })
})

test('serialises with local resource', (t) => {
  const gs = new GetStep('a')

  const r = new Resource(
    'r',
    new ResourceType('rt', (rt) => {
      rt.set_type('registry-image')
    })
  )

  gs.set_get(r)

  t.deepEqual(gs.serialise(), {
    ...default_get_step,
    get: 'r',
  })
})
