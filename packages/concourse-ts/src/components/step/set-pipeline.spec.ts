import test from 'ava'

import {SetPipelineStep} from './set-pipeline'

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

const default_set_pipeline_step = {
  ...default_step,
  team: undefined,
  var_files: undefined,
  vars: undefined,
  set_pipeline: undefined,
  file: undefined,
  instance_vars: undefined,
}

test.beforeEach(() => {
  SetPipelineStep.customise((sps) => {
    sps.add_tag('static')
  })
})

test('runs static customiser', (t) => {
  const sps = new SetPipelineStep('a')

  t.deepEqual(sps.serialise(), default_set_pipeline_step)
})

test('runs instance customiser', (t) => {
  const sps = new SetPipelineStep('a', (a) => {
    a.add_tag('instance')
  })

  t.deepEqual(sps.serialise(), {
    ...default_set_pipeline_step,
    tags: ['static', 'instance'],
  })
})

test('collects resources', (t) => {
  const sps = new SetPipelineStep('a')

  const result = sps.get_resources()

  t.is(result.length, 0)
  t.deepEqual(result, [])
})

test('collects task steps', (t) => {
  const sps = new SetPipelineStep('a')

  const result = sps.get_task_steps()

  t.is(result.length, 0)
  t.deepEqual(result, [])
})

test('stores instance vars', (t) => {
  const sps = new SetPipelineStep('a')

  sps.set_instance_var({
    key: 'my-var',
    value: '1',
  })

  sps.set_instance_var({
    key: 'my-var1',
    value: '2',
  })

  t.deepEqual(sps.serialise(), {
    ...default_set_pipeline_step,
    instance_vars: {
      'my-var': '1',
      'my-var1': '2',
    },
  })
})

test('stores vars', (t) => {
  const sps = new SetPipelineStep('a')

  sps.set_var({
    key: 'my-var',
    value: '1',
  })

  sps.set_var({
    key: 'my-var1',
    value: '2',
  })

  t.deepEqual(sps.serialise(), {
    ...default_set_pipeline_step,
    vars: {
      'my-var': '1',
      'my-var1': '2',
    },
  })
})

test('stores var_files', (t) => {
  const sps = new SetPipelineStep('a')

  sps.add_var_file('my-file')

  t.deepEqual(sps.serialise(), {
    ...default_set_pipeline_step,
    var_files: ['my-file'],
  })
})
