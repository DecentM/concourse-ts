import test from 'ava'

import {Duration} from '../utils/duration'
import {default_step} from './step/test-data/default-steps'

import {ResourceType, Resource, Job} from '..'

test.beforeEach(() => {
  Resource.customise((resource) => {
    resource.add_tag('customised')
  })

  Resource.customise_get_step((gs) => {
    gs.add_tag('static')
  })

  Resource.customise_put_step((ps) => {
    ps.add_tag('static')
  })
})

test('throws if the type is unassigned', (t) => {
  const r = new Resource('my-r', null as never)

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

  t.deepEqual(result.tags, ['customised', 'my tag 1'])
})

test('stores valid Durations into check_every', (t) => {
  const r = new ResourceType('my-rt').create_resource('r')

  r.set_check_every({minutes: 1})

  const result = r.serialise()

  t.is(result.check_every, '1m' as Duration)
})

test('stores "never" into check_every', (t) => {
  const r = new ResourceType('my-rt').create_resource('r')

  r.set_check_every('never')

  const result = r.serialise()

  t.is(result.check_every, 'never')
})

test('refuses to store invalid Durations into check_every', (t) => {
  const r = new ResourceType('my-rt').create_resource('r')

  t.throws(() => r.set_check_every({hours: -1}))
})

test('initialiser passes reference to "this"', (t) => {
  const rt = new ResourceType('my-rt')

  let result: unknown = undefined

  const r = new Resource('my-r', rt, (r) => {
    result = r
  })

  t.is(result, r)
})

test('runs get-step customiser', (t) => {
  const rt = new ResourceType('my-rt', (rt) => {
    rt.set_type('registry-image')
  })

  const r = new Resource('my-r', rt, (r) => {
    r.customise_get_step((gs) => {
      gs.add_tag('customised')
    })
  })

  t.deepEqual(r.as_get_step().serialise(), {
    ...default_step,
    get: 'my-r',
    params: undefined,
    passed: undefined,
    resource: undefined,
    tags: ['static', 'customised'],
    trigger: undefined,
    version: undefined,
  })
})

test('runs put-step customiser', (t) => {
  const rt = new ResourceType('my-rt', (rt) => {
    rt.set_type('registry-image')
  })

  const r = new Resource('my-r', rt, (r) => {
    r.customise_put_step((gs) => {
      gs.add_tag('customised')
    })
  })

  t.deepEqual(r.as_put_step().serialise(), {
    ...default_step,
    put: 'my-r',
    params: undefined,
    resource: undefined,
    tags: ['static', 'customised'],
    inputs: undefined,
    get_params: undefined,
  })
})

test('creates put step', (t) => {
  const rt = new ResourceType('my-rt', (rt) => {
    rt.set_type('registry-image')
  })

  const r = new Resource('my-r', rt)
  const ps = r.as_put_step(
    {
      params: {
        my_param: 'a',
      },
      inputs: 'all',
    },
    (ps) => {
      ps.add_tag('tag')
    }
  )

  t.deepEqual(ps.serialise(), {
    ...default_step,
    inputs: 'all',
    params: {
      my_param: 'a',
    },
    put: 'my-r',
    resource: undefined,
    tags: ['static', 'tag'],
    get_params: undefined,
  })
})

test('creates get step', (t) => {
  const rt = new ResourceType('my-rt', (rt) => {
    rt.set_type('registry-image')
  })

  const j = new Job('j')

  const r = new Resource('my-r', rt)
  const ps = r.as_get_step(
    {
      params: {
        my_param: 'a',
      },
      passed: [j],
      trigger: false,
    },
    (ps) => {
      ps.add_tag('tag')
    }
  )

  t.deepEqual(ps.serialise(), {
    ...default_step,
    get: 'my-r',
    params: {
      my_param: 'a',
    },
    tags: ['static', 'tag'],
    passed: ['j'],
    trigger: false,
    version: undefined,
    resource: undefined,
  })
})

test('unwraps deep resource type chains', (t) => {
  const sub_rt = new ResourceType('sub_rt', (rt) => {
    rt.set_type('registry-image')
  })

  const rt = new ResourceType('rt', (rt) => {
    rt.set_type(sub_rt)
  })

  const r = new Resource('my-r', rt)

  t.deepEqual(r.get_resource_types(), [rt, sub_rt])
})
