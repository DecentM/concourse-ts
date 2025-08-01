import test from 'ava'

import { Config } from '../declarations/types.js'
import { Duration, has_duplicates_by_key } from '../utils/index.js'

import { ResourceType, Pipeline, Job, GetStep } from '../index.js'

test.beforeEach(() => {
  ResourceType.customise((rt) => {
    rt.set_type('registry-image')
  })
})

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

  j.add_steps(gs1)
  j.add_steps(gs2)

  p.add_job(j)

  const result = p.serialise()

  t.truthy(result)
  t.truthy(result.resource_types)

  t.is(result.resource_types!.length, 1)
  t.false(has_duplicates_by_key((item) => item.name, result.resource_types!))
})

test('throws if the type is unassigned', (t) => {
  const rt = new ResourceType('my-rt')

  rt.set_type('')

  t.throws(
    () => {
      rt.serialise()
    },
    {
      message: 'identifier cannot be an empty string',
      any: true,
    }
  )
})

test('stores tags', (t) => {
  const rt = new ResourceType('my-rt')

  rt.add_tags('my tag 1')

  const result = rt.serialise()

  t.true(result.tags!.includes('my tag 1'))
})

test('stores params', (t) => {
  const rt = new ResourceType('my-rt')

  rt.set_params({ name: '33' })

  const result = rt.serialise()

  t.is(result.params!['name'], '33')
})

test('stores defaults', (t) => {
  const rt = new ResourceType('my-rt')

  rt.set_defaults({ name: '33' })

  const result = rt.serialise()

  t.is(result.defaults!['name'], '33')
})

test('stores valid Durations into check_every', (t) => {
  const rt = new ResourceType('my-rt')

  rt.set_check_every({ minutes: 1 })

  const result = rt.serialise()

  t.is(result.check_every, '1m' as Duration)
})

test('refuses to store "never" into check_every', (t) => {
  const rt = new ResourceType('my-rt')

  t.throws(() => rt.set_check_every('never'), {
    any: true,
    message: `Duration "never" given to ${rt.name} is not allowed`,
  })
})

test('refuses to store invalid Durations into check_every', (t) => {
  const rt = new ResourceType('my-rt')

  t.throws(() => rt.set_check_every({ microseconds: -1 }), {
    any: true,
    message:
      'Duration value must be positive, but got -1. Change this to a positive number, or remove the duration component.',
  })
})

test('runs resource customiser', (t) => {
  const rt = new ResourceType('my-rt')

  rt.customise_resource((resource) => {
    resource.add_tags('customised')
  })

  const resource = rt.create_resource('my-r', (my_r) => {
    my_r.set_icon('a')
  })

  t.deepEqual(resource.serialise(), {
    check_every: undefined,
    icon: 'a',
    name: 'my-r',
    old_name: undefined,
    public: undefined,
    source: undefined,
    tags: ['customised'],
    type: 'my-rt',
    version: undefined,
    webhook_token: undefined,
  })
})

test('runs instance customiser', (t) => {
  const rt = new ResourceType('rt', (rt) => {
    rt.add_tags('added')
  })

  t.deepEqual(rt.serialise(), {
    check_every: undefined,
    defaults: undefined,
    name: 'rt',
    params: undefined,
    privileged: undefined,
    source: undefined,
    tags: ['added'],
    type: 'registry-image',
  })
})

test('get_type returns null if the subtype is a string', (t) => {
  const rt = new ResourceType('rt', (rt) => {
    rt.set_type('registry-image')
  })

  t.is(rt.get_type(), null)
})

test('get_type returns resource type if the subtype is another resource type', (t) => {
  const sub_rt = new ResourceType('sub_rt', (rt) => {
    rt.set_type('registry-image')
  })

  const rt = new ResourceType('rt', (rt) => {
    rt.set_type(sub_rt)
  })

  t.is(rt.get_type(), sub_rt)
})

test('serialises object resource type into an indentifier', (t) => {
  const sub_rt = new ResourceType('sub_rt', (rt) => {
    rt.set_type('registry-image')
  })

  const rt = new ResourceType('rt', (rt) => {
    rt.set_type(sub_rt)
  })

  t.deepEqual(rt.serialise(), {
    check_every: undefined,
    defaults: undefined,
    name: 'rt',
    params: undefined,
    privileged: undefined,
    source: undefined,
    tags: undefined,
    type: 'sub_rt',
  })
})
