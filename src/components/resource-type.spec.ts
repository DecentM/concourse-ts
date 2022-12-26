import test from 'ava'
import {Duration} from '~/declarations/types'
import {has_duplicates_by_key} from '~/utils/array-duplicates'
import {ResourceType, Pipeline, Type} from '..'

test('does not serialise duplicate resource types', (t) => {
  const p = new Pipeline('my-pipeline')
  const rt = new ResourceType('my-rt')

  const r1 = rt.create_resource('r1')
  const r2 = rt.create_resource('r2')

  p.add_resource(r1)
  p.add_resource(r2)

  const result = p.serialise()

  t.truthy(result)
  t.truthy(result.resource_types)

  t.is(result.resource_types.length, 1)
  t.false(has_duplicates_by_key('name', p.serialise().resource_types))
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

  t.true(result.tags.includes('my tag 1'))
})

test('stores params', (t) => {
  const rt = new ResourceType('my-rt')

  rt.set_param({key: 'name', value: '33'})

  const result = rt.serialise()

  t.is(result.params.name, '33')
})

test('stores defaults', (t) => {
  const rt = new ResourceType('my-rt')

  rt.set_default({key: 'name', value: '33'})

  const result = rt.serialise()

  t.is(result.defaults.name, '33')
})

test('stores valid Durations into check_every', (t) => {
  const rt = new ResourceType('my-rt')

  rt.set_check_every('1m')

  const result = rt.serialise()

  t.is(result.check_every, '1m' as Duration)
})

test('refuses to store "never" into check_every', (t) => {
  const rt = new ResourceType('my-rt')

  t.throws(() => rt.set_check_every('never'))
})

test('refuses to store invalid Durations into check_every', (t) => {
  const rt = new ResourceType('my-rt')

  t.throws(() => rt.set_check_every('1a'))
})
