import test from 'ava'
import {Identifier} from '../../utils'
import {Task} from '../task'

import {TaskStep} from './task'

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

const default_task_step = {
  ...default_step,
  config: undefined,
  task: 'a_task',
  vars: undefined,
  file: undefined,
  image: undefined,
  input_mapping: undefined,
  output_mapping: undefined,
  params: undefined,
  privileged: undefined,
}

test.beforeEach(() => {
  TaskStep.customise((ts) => {
    ts.add_tag('static')
  })
})

test('runs static customiser', (t) => {
  const ts = new TaskStep('a')

  t.deepEqual(ts.serialise(), default_task_step)
})

test('runs instance customiser', (t) => {
  const ts = new TaskStep('a', (a) => {
    a.add_tag('instance')
  })

  t.deepEqual(ts.serialise(), {
    ...default_task_step,
    tags: ['static', 'instance'],
  })
})

test('collects resources', (t) => {
  const ts = new TaskStep('a')

  const result0 = ts.get_resources()

  t.is(result0.length, 0)
  t.deepEqual(result0, [])
})

test('collects task steps', (t) => {
  const ts = new TaskStep('a')

  const result = ts.get_task_steps()

  t.is(result.length, 1)
  t.deepEqual(result, [ts])
})

test('stores tasks', (t) => {
  const ts = new TaskStep('a')

  const task = new Task('at')

  ts.set_task(task)

  t.is(ts.get_task(), task)

  t.deepEqual(ts.serialise(), {
    ...default_task_step,
    task: 'at',
    config: {
      caches: [],
      container_limits: undefined,
      image_resource: undefined,
      inputs: undefined,
      outputs: undefined,
      params: undefined,
      platform: undefined,
      rootfs_uri: undefined,
      run: undefined,
    },
  })
})

test('stores files', (t) => {
  const ts = new TaskStep('a')

  ts.set_file('f')

  t.deepEqual(ts.serialise(), {
    ...default_task_step,
    file: 'f',
  })
})

test('stores vars', (t) => {
  const ts = new TaskStep('a')

  ts.set_var({
    key: 'my-var',
    value: '1',
  })

  ts.set_var({
    key: 'my-var1',
    value: '2',
  })

  t.deepEqual(ts.serialise(), {
    ...default_task_step,
    vars: {
      'my-var': '1',
      'my-var1': '2',
    },
  })
})

test('stores params', (t) => {
  const ts = new TaskStep('a')

  ts.set_param({
    key: 'my-param',
    value: '1',
  })

  ts.set_param({
    key: 'my-param1',
    value: '2',
  })

  t.deepEqual(ts.serialise(), {
    ...default_task_step,
    params: {
      'my-param': '1',
      'my-param1': '2',
    },
  })
})

test('stores input_mapping', (t) => {
  const ts = new TaskStep('a')

  ts.set_input_mapping(
    'my_input' as Identifier,
    'my_mapped_input' as Identifier
  )

  ts.set_input_mapping(
    'my_input1' as Identifier,
    'my_mapped_input1' as Identifier
  )

  t.deepEqual(ts.serialise(), {
    ...default_task_step,
    input_mapping: {
      my_input: 'my_mapped_input',
      my_input1: 'my_mapped_input1',
    },
  })
})

test('stores ouptut_mapping', (t) => {
  const ts = new TaskStep('a')

  ts.set_output_mapping(
    'my_output' as Identifier,
    'my_mapped_output' as Identifier
  )

  ts.set_output_mapping(
    'my_output1' as Identifier,
    'my_mapped_output1' as Identifier
  )

  t.deepEqual(ts.serialise(), {
    ...default_task_step,
    output_mapping: {
      my_output: 'my_mapped_output',
      my_output1: 'my_mapped_output1',
    },
  })
})
