import test from 'ava'
import * as ConcourseTs from '@decentm/concourse-ts'

import { GetStepBuilder } from './get'

test('builds', (t) => {
  const builder = new GetStepBuilder()
    .name('my-get-step')
    .get((s) => {
      s.name('my-resource').type((type) => type.name('gst').type('registry-image'))
    })
    .params({
      my_param: '1',
    })
    .trigger()
    .version('every')

  const result = JSON.parse(JSON.stringify(builder.build()))

  t.deepEqual(result, {
    name: 'my-get-step',
    params: {
      my_param: '1',
    },
    resource: {
      name: 'my-resource',
      type: {
        name: 'gst',
        type: 'registry-image',
      },
    },
    trigger: true,
    version: 'every',
  })
})

test('throws without name', (t) => {
  const builder = new GetStepBuilder()

  t.throws(
    () => {
      builder.build()
    },
    {
      any: true,
      name: 'VError',
      message: 'Cannot build get step without a name',
    }
  )
})

test('builds with prebuilt resource', (t) => {
  const r = new ConcourseTs.Resource('my-r', new ConcourseTs.ResourceType('my-rt'))
  const builder = new GetStepBuilder().name('my-get-step').get(r)

  const result = JSON.parse(JSON.stringify(builder.build()))

  t.deepEqual(result, {
    name: 'my-get-step',
    resource: {
      name: 'my-r',
      type: {
        name: 'my-rt',
      },
    },
  })
})

test('throws when attempting to overwrite an existing resource', (t) => {
  const r = new ConcourseTs.Resource('my-r', new ConcourseTs.ResourceType('my-rt'))
  const builder = new GetStepBuilder().name('my-get-step').get(r)

  t.throws(
    () => {
      builder.get(r)
    },
    {
      any: true,
      name: 'VError',
      message: 'Cannot overwrite resource or resource customiser on "my-get-step"',
    }
  )
})
