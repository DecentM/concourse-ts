import test from 'ava'
import {Duration} from '../declarations/types'
import {ResourceType, Resource} from '..'
import {get_duration} from '../utils'

test('throws if the type is unassigned', (t) => {
  const r = new Resource('my-r', null as any)

  t.throws(() => r.serialise())
})

test('stores versions', (t) => {
  const rt = new ResourceType('my-rt').create_resource('r')

  rt.set_version('every')
  t.is(rt.serialise().version, 'every')

  rt.set_version('latest')
  t.is(rt.serialise().version, 'latest')

  rt.set_version({someKey: 'someValue'})
  t.deepEqual(rt.serialise().version, {someKey: 'someValue'})
})

test('stores tags', (t) => {
  const r = new ResourceType('my-rt').create_resource('r')

  r.add_tag('my tag 1')

  const result = r.serialise()

  t.deepEqual(result.tags, ['my tag 1'])
})

test('stores valid Durations into check_every', (t) => {
  const r = new ResourceType('my-rt').create_resource('r')
  const one_minute = get_duration({minutes: 1})

  r.set_check_every(one_minute)

  const result = r.serialise()

  t.is(result.check_every, one_minute)
})

test('stores "never" into check_every', (t) => {
  const r = new ResourceType('my-rt').create_resource('r')
  const never = get_duration('never')

  r.set_check_every(never)

  const result = r.serialise()

  t.is(result.check_every, never)
})

test('refuses to store invalid Durations into check_every', (t) => {
  const r = new ResourceType('my-rt').create_resource('r')

  t.throws(() => r.set_check_every('1a' as Duration))
})

test('initialiser passes reference to "this"', (t) => {
  const rt = new ResourceType('my-rt')

  let result: Resource | null = null

  const r = new Resource('my-r', rt, (r) => {
    result = r
  })

  t.is(result as unknown as Resource, r)
})
