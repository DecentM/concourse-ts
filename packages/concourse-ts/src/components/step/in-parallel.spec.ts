import test from 'ava'
import {Resource, ResourceType, Task} from '..'

import {InParallelStep} from './in-parallel'
import {default_in_parallel_step} from './test-data/default-steps'

test('runs static customiser', (t) => {
  InParallelStep.customise((ips) => {
    ips.attempts = 2
  })

  const ips = new InParallelStep('a')

  t.deepEqual(ips.serialise(), {
    ...default_in_parallel_step,
    attempts: 2,
  })

  InParallelStep.customise(() => null)
})

test('runs instance customiser', (t) => {
  const ips = new InParallelStep('a', (a) => {
    a.add_tag('instance')
  })

  t.deepEqual(ips.serialise(), {
    ...default_in_parallel_step,
    tags: ['instance'],
  })
})

test('collects resources', (t) => {
  const ips = new InParallelStep('a')

  const r = new Resource(
    'r',
    new ResourceType('rt', (rt) => {
      rt.set_type('registry-image')
    })
  )

  const result0 = ips.get_resources()

  t.is(result0.length, 0)
  t.deepEqual(result0, [])

  ips.add_step(r.as_get_step())

  const result = ips.get_resources()

  t.is(result.length, 1)
  t.deepEqual(result, [r])
})

test('collects task steps', (t) => {
  const ips = new InParallelStep('a')

  const task = new Task('t', (t) => {
    t.platform = 'linux'
  })

  const ts = task.as_task_step()

  ips.add_step(ts)

  const result = ips.get_task_steps()

  t.is(result.length, 1)
  t.deepEqual(result, [ts])
})
