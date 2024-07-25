import test from 'ava'
import * as ConcourseTs from '@decentm/concourse-ts'

import { ResourceBuilder } from './resource.js'

test('builds', (t) => {
  const builder = new ResourceBuilder()
    .name('my-r')
    .type((type_builder) => {
      type_builder.name('my-rt').type('registry-image')
    })
    .check_every({ hours: 1 })
    .source({ my_source: 1 })
    .tag('tag-1', 'tag-2')
    .webhook_token('a')
    .icon('check')
    .old_name('my-old-r')
    .public()
    .version('every')

  const result = JSON.parse(JSON.stringify(builder.build().serialise()))

  t.deepEqual(result, {
    name: 'my-r',
    type: 'my-rt',
    source: {
      my_source: 1,
    },
    tags: ['tag-1', 'tag-2'],
    check_every: '1h',
    icon: 'check',
    old_name: 'my-old-r',
    public: true,
    version: 'every',
    webhook_token: 'a',
  })
})

test('builds with prebuilt type', (t) => {
  const builder = new ResourceBuilder()
    .name('my-r')
    .type(new ConcourseTs.ResourceType('my-rt'))

  const result = JSON.parse(JSON.stringify(builder.build().serialise()))

  t.deepEqual(result, {
    name: 'my-r',
    type: 'my-rt',
  })
})

test('throws when building without a type', (t) => {
  const builder = new ResourceBuilder().name('my-r')

  t.throws(
    () => {
      builder.build()
    },
    {
      any: true,
      name: 'VError',
      message: 'Cannot build resource "my-r" without a type',
    }
  )
})

test('throws when building without a name', (t) => {
  const builder = new ResourceBuilder()

  t.throws(
    () => {
      builder.build()
    },
    {
      any: true,
      name: 'VError',
      message: 'Cannot build resource without a name',
    }
  )
})
