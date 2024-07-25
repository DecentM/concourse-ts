import test from 'ava'
import { Job, Resource, ResourceType } from '../index.js'

import { GetStep } from './get.js'
import { default_get_step } from './test-data/default-steps.js'

test('runs static customiser', (t) => {
  GetStep.customise((ds) => {
    ds.attempts = 2
  })

  const gs = new GetStep('a')

  t.deepEqual(gs.serialise(), {
    ...default_get_step,
    attempts: 2,
    get: undefined,
  })

  GetStep.customise(() => null)
})

test('runs instance customiser', (t) => {
  const gs = new GetStep('a', (a) => {
    a.add_tag('instance')
  })

  t.deepEqual(gs.serialise(), {
    ...default_get_step,
    tags: ['instance'],
    get: undefined,
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
    get: undefined,
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
    get: undefined,
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
