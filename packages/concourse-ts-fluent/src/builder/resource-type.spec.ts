import test from 'ava'

import { ResourceTypeBuilder } from './resource-type'

test('builds', (t) => {
  const builder = new ResourceTypeBuilder()
    .name('my-rt')
    .type('registry-image')
    .check_every({ hours: 1 })
    .defaults({ my_default: 1 })
    .params({ my_param: 1 })
    .privileged()
    .source({ my_source: 1 })
    .tag('tag-1', 'tag-2')

  const result = JSON.parse(JSON.stringify(builder.build().serialise()))

  t.deepEqual(result, {
    name: 'my-rt',
    type: 'registry-image',
    defaults: {
      my_default: 1,
    },
    params: {
      my_param: 1,
    },
    privileged: true,
    source: {
      my_source: 1,
    },
    tags: ['tag-1', 'tag-2'],
    check_every: '1h',
  })
})

test('throws when building without a type', (t) => {
  const builder = new ResourceTypeBuilder().name('my-rt')

  t.throws(
    () => {
      builder.build()
    },
    {
      any: true,
      name: 'VError',
      message: 'Cannot build resource type "my-rt" without a type',
    }
  )
})

test('throws when building without a name', (t) => {
  const builder = new ResourceTypeBuilder()

  t.throws(
    () => {
      builder.build()
    },
    {
      any: true,
      name: 'VError',
      message: 'Cannot build resource type without a name',
    }
  )
})
