import anyTest, {TestFn} from 'ava'
import {Resource, Task} from '..'
import {deduplicate_by_identity} from '../../utils'
import {ResourceType} from '../resource-type'

import {Step} from './base'

const test = anyTest as TestFn<{step: Step<never>}>

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
  get: 'r',
  params: undefined,
  passed: [],
  resource: undefined,
  timeout: undefined,
  trigger: undefined,
  version: undefined,
}

const default_task_step = {
  ...default_step,
  config: {
    caches: [],
    container_limits: undefined,
    image_resource: undefined,
    inputs: undefined,
    outputs: undefined,
    params: undefined,
    platform: 'linux',
    rootfs_uri: undefined,
    run: undefined,
  },
  file: undefined,
  image: undefined,
  input_mapping: undefined,
  output_mapping: undefined,
  params: undefined,
  privileged: undefined,
  task: 't',
  vars: undefined,
}

test.beforeEach((t) => {
  Step.customise_base((step) => {
    step.add_tag('static')
  })

  t.context.step = new TStep('a')
})

test('runs static customiser', (t) => {
  t.deepEqual(t.context.step.serialise(), default_step)
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
    on_abort: {...default_step, do: [default_get_step]},
    on_success: {...default_step, do: [default_get_step]},
    on_error: {...default_step, do: [default_get_step]},
    on_failure: {...default_step, do: [default_get_step]},
    ensure: {...default_step, do: [default_get_step]},
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
    on_abort: {...default_step, do: [default_task_step]},
    on_success: {...default_step, do: [default_task_step]},
    on_error: {...default_step, do: [default_task_step]},
    on_failure: {...default_step, do: [default_task_step]},
    ensure: {...default_step, do: [default_task_step]},
  })
})
