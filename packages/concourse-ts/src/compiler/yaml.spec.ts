import test from 'ava'
import * as YAML from 'yaml'

import {Identifier} from '../utils'
import {Pipeline, Task} from '../declarations'

import {write_yaml} from './yaml'

test('writes empty pipeline', (t) => {
  const result = write_yaml({
    jobs: [],
  })

  t.assert(result.includes('# jobs: 0'))
  t.deepEqual(YAML.parse(result), {
    jobs: [],
  })
})

test('writes pipeline with resources', (t) => {
  const pipeline: Pipeline = {
    jobs: [],
    resources: [],
    resource_types: [],
    groups: [],
    var_sources: [],
  }

  const result = write_yaml(pipeline)

  t.assert(result.includes('# jobs: 0'))
  t.assert(result.includes('# resources: 0'))
  t.assert(result.includes('# resource_types: 0'))
  t.assert(result.includes('# groups: 0'))
  t.assert(result.includes('# var_sources: 0'))

  t.deepEqual(YAML.parse(result), pipeline)
})

test('writes empty task', (t) => {
  const task: Task<Identifier, Identifier> = {
    image_resource: {
      source: {},
      type: '' as Identifier,
    },
    platform: 'linux',
    run: {
      path: '',
    },
  }

  const result = write_yaml(task)

  t.deepEqual(YAML.parse(result), task)
})

test('writes task with inputs/outputs', (t) => {
  const task: Task<Identifier, Identifier> = {
    image_resource: {
      source: {},
      type: '' as Identifier,
    },
    platform: 'linux',
    run: {
      path: '',
    },
    inputs: [],
    outputs: [],
    params: {},
  }

  const result = write_yaml(task)

  t.assert(result.includes('# platform: linux'))
  t.assert(result.includes('# inputs: 0'))
  t.assert(result.includes('# outputs: 0'))
  t.assert(result.includes('# params: 0'))

  t.deepEqual(YAML.parse(result), task)
})
