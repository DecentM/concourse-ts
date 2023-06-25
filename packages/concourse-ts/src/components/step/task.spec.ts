import test from 'ava'
import {Task} from '../task'

import {TaskStep} from './task'
import {
  default_task_step,
  default_task_step_config,
} from './test-data/default-steps'

test('runs static customiser', (t) => {
  TaskStep.customise((ts) => {
    ts.attempts = 2
  })

  const ts = new TaskStep('a')

  t.deepEqual(ts.serialise(), {
    ...default_task_step,
    attempts: 2,
    task: 'a_task',
  })

  TaskStep.customise(() => null)
})

test('runs instance customiser', (t) => {
  const ts = new TaskStep('a', (a) => {
    a.add_tag('instance')
  })

  t.deepEqual(ts.serialise(), {
    ...default_task_step,
    tags: ['instance'],
    task: 'a_task',
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
    config: {
      ...default_task_step_config,
      platform: undefined,
    },
    task: 'at',
  })
})

test('stores files', (t) => {
  const ts = new TaskStep('a')

  ts.set_file('f')

  t.deepEqual(ts.serialise(), {
    ...default_task_step,
    task: 'a_task',
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
    task: 'a_task',
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
    task: 'a_task',
    params: {
      'my-param': '1',
      'my-param1': '2',
    },
  })
})

test('stores input_mapping', (t) => {
  const ts = new TaskStep('a')

  ts.set_input_mapping('my_input', 'my_mapped_input')

  ts.set_input_mapping('my_input1', 'my_mapped_input1')

  t.deepEqual(ts.serialise(), {
    ...default_task_step,
    task: 'a_task',
    input_mapping: {
      my_input: 'my_mapped_input',
      my_input1: 'my_mapped_input1',
    },
  })
})

test('stores ouptut_mapping', (t) => {
  const ts = new TaskStep('a')

  ts.set_output_mapping('my_output', 'my_mapped_output')

  ts.set_output_mapping('my_output1', 'my_mapped_output1')

  t.deepEqual(ts.serialise(), {
    ...default_task_step,
    task: 'a_task',
    output_mapping: {
      my_output: 'my_mapped_output',
      my_output1: 'my_mapped_output1',
    },
  })
})
