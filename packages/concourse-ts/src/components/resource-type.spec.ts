import test from 'ava'

import {ResourceType, Pipeline, Job, GetStep} from '..'
import {Config, Duration} from '../declarations/types'
import {get_duration} from '../utils'
import {has_duplicates_by_key} from '../utils/array-duplicates'

test('does not serialise duplicate resource types', (t) => {
  const p = new Pipeline('my-pipeline')
  const rt = new ResourceType('my-rt')

  const j = new Job('asd')
  const r1 = rt.create_resource('r1')
  const r2 = rt.create_resource('r2')
  const gs1 = new GetStep<Config>('task-step')
  const gs2 = new GetStep<Config>('task-step-2')

  gs1.set_get(r1)
  gs2.set_get(r2)

  j.add_step(gs1)
  j.add_step(gs2)

  p.add_job(j)

  const result = p.serialise()

  t.truthy(result)
  t.truthy(result.resource_types)

  t.is(result.resource_types?.length, 1)

  if (!result.resource_types) {
    t.fail('no resource types generated')
    return
  }

  t.false(has_duplicates_by_key((item) => item.name, result.resource_types))
})

test('throws if the type is unassigned', (t) => {
  const rt = new ResourceType('my-rt')

  rt.type = ''

  t.throws(() => rt.serialise())
})

test('stores tags', (t) => {
  const rt = new ResourceType('my-rt')

  rt.add_tag('my tag 1')

  const result = rt.serialise()

  t.true(result.tags?.includes('my tag 1'))
})

test('stores params', (t) => {
  const rt = new ResourceType('my-rt')

  rt.set_param({key: 'name', value: '33'})

  const result = rt.serialise()

  t.is(result.params?.['name'], '33')
})

test('stores defaults', (t) => {
  const rt = new ResourceType('my-rt')

  rt.set_default({key: 'name', value: '33'})

  const result = rt.serialise()

  t.is(result.defaults?.['name'], '33')
})

test('stores valid Durations into check_every', (t) => {
  const rt = new ResourceType('my-rt')
  const one_minute = get_duration({minutes: 1})

  rt.set_check_every(one_minute)

  const result = rt.serialise()

  t.is(result.check_every, one_minute)
})

test('refuses to store "never" into check_every', (t) => {
  const rt = new ResourceType('my-rt')
  const never = get_duration('never')

  t.throws(() => rt.set_check_every(never), {
    message: 'Duration never is malformed',
  })
})

test('refuses to store invalid Durations into check_every', (t) => {
  const rt = new ResourceType('my-rt')

  t.throws(() => rt.set_check_every('1a' as Duration), {
    message: 'Duration 1a is malformed',
  })
})
