import test from 'ava'
import {Resource, ResourceType, Task} from '..'
import {Identifier} from '../../utils'

import {DoStep} from './do'
import {LoadVarStep} from './load-var'

import {default_step} from './test-data/default-steps'

const default_do_step = {
  ...default_step,
  do: [],
}

test('runs static customiser', (t) => {
  DoStep.customise((ds) => {
    ds.attempts = 2
  })

  const ds = new DoStep('a')

  t.deepEqual(ds.serialise(), {
    ...default_do_step,
    attempts: 2,
  })

  DoStep.customise(() => null)
})

test('runs instance customiser', (t) => {
  const ds = new DoStep('a', (a) => {
    a.add_tag('instance')
  })

  t.deepEqual(ds.serialise(), {
    ...default_do_step,
    tags: ['instance'],
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
        tags: undefined,
      },
      {
        ...default_step,
        file: '/a',
        format: undefined,
        load_var: 'a',
        reveal: undefined,
        tags: undefined,
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
