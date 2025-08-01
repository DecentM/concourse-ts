import test from 'ava'
import { Resource, ResourceType, Task } from '../index.js'

import { InParallelStep } from './in-parallel.js'
import { default_in_parallel_step } from './test-data/default-steps.js'

test('runs static customiser', (t) => {
  InParallelStep.customise((ips) => {
    ips.set_attempts(2)
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
    a.add_tags('instance')
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

  ips.add_steps(r.as_get_step())

  const result = ips.get_resources()

  t.is(result.length, 1)
  t.deepEqual(result, [r])
})

test('collects task steps', (t) => {
  const ips = new InParallelStep('a')

  const task = new Task('t', (t) => {
    t.set_platform('linux')
  })

  const ts = task.as_task_step()

  ips.add_steps(ts)

  const result = ips.get_task_steps()

  t.is(result.length, 1)
  t.deepEqual(result, [ts])
})
