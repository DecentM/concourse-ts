import test from 'ava'
import { Resource, ResourceType, Task } from '../index.js'

import { DoStep } from './do.js'
import { LoadVarStep } from './load-var.js'

import { default_step } from './test-data/default-steps.js'

const default_do_step = {
  ...default_step,
  do: [],
}

test('runs static customiser', (t) => {
  DoStep.customise((ds) => {
    ds.set_attempts(2)
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
    a.add_tags('instance')
  })

  t.deepEqual(ds.serialise(), {
    ...default_do_step,
    tags: ['instance'],
  })
})

test('stores steps', (t) => {
  const ds = new DoStep('ds')
  const step = new LoadVarStep('lvs', (lvs) => {
    lvs.set_load_var('a')
    lvs.set_file('/a')
  })
  const step1 = new LoadVarStep('lvs1', (lvs) => {
    lvs.set_load_var('b')
    lvs.set_file('/b')
  })

  ds.add_steps(step)
  ds.add_steps_first(step1)

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

  ds.add_steps(r.as_get_step())

  const result = ds.get_resources()

  t.is(result.length, 1)
  t.deepEqual(result, [r])
})

test('collects task steps', (t) => {
  const ds = new DoStep('a')

  const ts = new Task('t', (t) => {
    t.set_platform('linux')
  }).as_task_step()

  ds.add_steps(ts)

  const result = ds.get_task_steps()

  t.is(result.length, 1)
  t.deepEqual(result, [ts])
})
