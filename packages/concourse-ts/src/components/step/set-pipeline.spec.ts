import test from 'ava'

import {SetPipelineStep} from './set-pipeline'
import {default_set_pipeline_step} from './test-data/default-steps'
import {Pipeline} from '../pipeline'

test('runs static customiser', (t) => {
  SetPipelineStep.customise((sps) => {
    sps.attempts = 2
  })

  const sps = new SetPipelineStep('a')

  t.deepEqual(sps.serialise(), {
    ...default_set_pipeline_step,
    attempts: 2,
  })

  SetPipelineStep.customise(() => null)
})

test('runs instance customiser', (t) => {
  const sps = new SetPipelineStep('a', (a) => {
    a.add_tag('instance')
  })

  t.deepEqual(sps.serialise(), {
    ...default_set_pipeline_step,
    tags: ['instance'],
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

  sps.set_instance_vars({
    'my-var': '1',
  })

  sps.set_instance_vars({
    'my-var1': '2',
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

  sps.set_vars({
    'my-var': '1',
  })

  sps.set_vars({
    'my-var1': '2',
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

test('stores set-pipeline', (t) => {
  const sps = new SetPipelineStep('a')

  sps.set_pipeline = new Pipeline('my-pipeline')

  t.deepEqual(sps.serialise(), {
    ...default_set_pipeline_step,
    set_pipeline: 'my-pipeline',
  })
})
