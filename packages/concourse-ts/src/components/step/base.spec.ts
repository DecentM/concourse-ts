import anyTest, { TestFn } from 'ava'
import { Resource, Task } from '../index.js'

import { ResourceType } from '../resource-type.js'

import {
  default_get_step,
  default_step,
  default_task_step_with_config,
} from './test-data/default-steps.js'

import { deduplicate_by_identity } from '../../utils/index.js'

import { Step } from './base.js'
import { Identifier } from '../../utils/identifier/index.js'

const test = anyTest as TestFn<{ step: Step<never> }>

class TStep extends Step<never> {
  public get_resources() {
    return this.get_base_resources()
  }

  public get_task_steps() {
    return this.get_base_task_steps()
  }

  public serialise() {
    return this.serialise_base() as never
  }
}

test.beforeEach((t) => {
  t.context.step = new TStep('a')
})

test('runs static customiser', (t) => {
  Step.customise_base((step) => {
    step.attempts = 2
  })

  const step = new TStep('a')

  t.deepEqual(step.serialise(), {
    ...default_step,
    attempts: 2,
  })

  Step.customise_base(() => null)
})

test('stores timeout', (t) => {
  t.context.step.set_timeout({
    hours: 1,
  })

  t.deepEqual(t.context.step.serialise(), {
    ...default_step,
    timeout: '1h',
  })
})

test('stores tags', (t) => {
  const step = new TStep('no-tags')

  step.add_tag('tagged')

  t.deepEqual(step.serialise(), {
    ...default_step,
    tags: ['tagged'],
  })
})

test('stores across', (t) => {
  t.context.step.add_across({
    values: ['my-a', 'my-b'],
    var: 'asd' as Identifier,
    fail_fast: true,
    max_in_flight: 1,
  })

  t.deepEqual(t.context.step.serialise(), {
    ...default_step,
    across: [
      {
        values: ['my-a', 'my-b'],
        var: 'asd',
        fail_fast: true,
        max_in_flight: 1,
      },
    ],
  })
})

test('collects base resources', (t) => {
  const rt = new ResourceType('rt', (rt) => {
    rt.set_type('registry-image')
  })

  const r = new Resource('r', rt)

  const result0 = t.context.step.get_resources()

  t.is(result0.length, 0)
  t.deepEqual(result0, [])
  t.deepEqual(t.context.step.serialise(), default_step)

  t.context.step.add_on_success(r.as_get_step())
  t.context.step.add_on_error(r.as_get_step())
  t.context.step.add_on_failure(r.as_get_step())
  t.context.step.add_on_abort(r.as_get_step())
  t.context.step.add_ensure(r.as_get_step())

  const result = t.context.step.get_resources()

  t.is(result.length, 5)
  t.deepEqual(deduplicate_by_identity(result), [r])
  t.deepEqual(t.context.step.serialise(), {
    ...default_step,
    on_abort: { do: [default_get_step] },
    on_success: { do: [default_get_step] },
    on_error: { do: [default_get_step] },
    on_failure: { do: [default_get_step] },
    ensure: { do: [default_get_step] },
  })
})

test('collects base task steps', (t) => {
  const ts = new Task('t', (t) => {
    t.platform = 'linux'
  }).as_task_step()

  const result0 = t.context.step.get_resources()

  t.is(result0.length, 0)
  t.deepEqual(result0, [])

  t.context.step.add_on_success(ts)
  t.context.step.add_on_error(ts)
  t.context.step.add_on_failure(ts)
  t.context.step.add_on_abort(ts)
  t.context.step.add_ensure(ts)

  const result = t.context.step.get_task_steps()

  t.is(result.length, 5)
  t.deepEqual(deduplicate_by_identity(result), [ts])
  t.deepEqual(t.context.step.serialise(), {
    ...default_step,
    on_abort: {
      do: [{ ...default_task_step_with_config, task: 't' }],
    },
    on_success: {
      do: [{ ...default_task_step_with_config, task: 't' }],
    },
    on_error: {
      do: [{ ...default_task_step_with_config, task: 't' }],
    },
    on_failure: {
      do: [{ ...default_task_step_with_config, task: 't' }],
    },
    ensure: {
      do: [{ ...default_task_step_with_config, task: 't' }],
    },
  })
})
