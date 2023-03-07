import test from 'ava'
import {Resource, ResourceType, Task} from '..'
import {Identifier} from '../../utils'

import {DoStep} from './do'
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

const default_do_step = {
  ...default_step,
  do: [],
}

test.beforeEach(() => {
  DoStep.customise((ds) => {
    ds.add_tag('static')
  })
})

test('runs static customiser', (t) => {
  const ds = new DoStep('a')

  t.deepEqual(ds.serialise(), default_do_step)
})

test('runs instance customiser', (t) => {
  const ds = new DoStep('a', (a) => {
    a.add_tag('instance')
  })

  t.deepEqual(ds.serialise(), {
    ...default_do_step,
    tags: ['static', 'instance'],
  })
})

test('stores steps', (t) => {
  const ds = new DoStep('ds')
  const step = new LoadVarStep('lvs', (lvs) => {
    lvs.load_var = 'a' as Identifier
    lvs.file = '/a'
  })
  const step1 = new LoadVarStep('lvs1', (lvs) => {
    lvs.load_var = 'b' as Identifier
    lvs.file = '/b'
  })

  ds.add_do(step)
  ds.add_do_first(step1)

  t.deepEqual(ds.serialise(), {
    ...default_step,
    do: [
      {
        ...default_step,
        file: '/b',
        format: undefined,
        load_var: 'b',
        reveal: undefined,
        tags: [],
      },
      {
        ...default_step,
        file: '/a',
        format: undefined,
        load_var: 'a',
        reveal: undefined,
        tags: [],
      },
    ],
  })
})

test('collects resources', (t) => {
  const ds = new DoStep('a')

  const r = new Resource(
    'r',
    new ResourceType('rt', (rt) => {
      rt.set_type('registry-image')
    })
  )

  ds.add_do(r.as_get_step())

  const result = ds.get_resources()

  t.is(result.length, 1)
  t.deepEqual(result, [r])
})

test('collects task steps', (t) => {
  const ds = new DoStep('a')

  const ts = new Task('t', (t) => {
    t.platform = 'linux'
  }).as_task_step()

  ds.add_do(ts)

  const result = ds.get_task_steps()

  t.is(result.length, 1)
  t.deepEqual(result, [ts])
})
