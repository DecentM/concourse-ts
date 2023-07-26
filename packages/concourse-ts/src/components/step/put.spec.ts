import test from 'ava'
import {Resource, ResourceType} from '..'

import {PutStep} from './put'
import {default_put_step} from './test-data/default-steps'

test('runs static customiser', (t) => {
  PutStep.customise((ps) => {
    ps.attempts = 2
  })

  const ps = new PutStep('a')

  t.deepEqual(ps.serialise(), {
    ...default_put_step,
    attempts: 2,
  })

  PutStep.customise(() => null)
})

test('runs instance customiser', (t) => {
  const ps = new PutStep('a', (a) => {
    a.add_tag('instance')
  })

  t.deepEqual(ps.serialise(), {
    ...default_put_step,
    tags: ['instance'],
  })
})

test('collects resources', (t) => {
  const ps = new PutStep('a')

  const result = ps.get_resources()

  t.is(result.length, 0)
  t.deepEqual(result, [])

  const r = new Resource(
    'r',
    new ResourceType('rt', (rt) => {
      rt.set_type('registry-image')
    })
  )

  ps.set_put(r)

  const result1 = ps.get_resources()

  t.is(result1.length, 1)
  t.deepEqual(result1, [r])
})

test('collects task steps', (t) => {
  const ps = new PutStep('a')

  const result = ps.get_task_steps()

  t.is(result.length, 0)
  t.deepEqual(result, [])
})

test('stores resource', (t) => {
  const ps = new PutStep('ps')

  const r = new Resource(
    'r',
    new ResourceType('rt', (rt) => {
      rt.set_type('registry-image')
    })
  )

  ps.set_put(r)

  t.deepEqual(ps.serialise(), {
    ...default_put_step,
    put: 'r',
  })
})

test('stores inputs', (t) => {
  const ps = new PutStep('ps')

  ps.set_inputs('all')

  t.deepEqual(ps.serialise(), {
    ...default_put_step,
    inputs: 'all',
  })
})

test('stores params', (t) => {
  const ps = new PutStep('ps')

  ps.set_params({
    my_param: '1',
  })

  t.deepEqual(ps.serialise(), {
    ...default_put_step,
    params: {
      my_param: '1',
    },
  })
})

test('stores get_params', (t) => {
  const ps = new PutStep('ps')

  ps.set_get_params({
    'my-param': '1',
  })

  t.deepEqual(ps.serialise(), {
    ...default_put_step,
    get_params: {
      'my-param': '1',
    },
  })
})
