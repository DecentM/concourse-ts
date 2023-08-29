import test from 'ava'
import * as ConcourseTs from '@decentm/concourse-ts'

import { PutStepBuilder } from './put'

test('builds', (t) => {
  const builder = new PutStepBuilder()
    .name('my-put-step')
    .inputs('all')
    .params({
      my_param: '1',
    })
    .get_params({
      my_get_param: '1',
    })
    .no_get()
    .put((s) => {
      s.name('my-resource').type((type) => type.name('pst').type('registry-image'))
    })

  const result = JSON.parse(JSON.stringify(builder.build()))

  t.deepEqual(result, {
    get_params: {
      my_get_param: '1',
    },
    inputs: 'all',
    name: 'my-put-step',
    no_get: true,
    params: {
      my_param: '1',
    },
    resource: {
      name: 'my-resource',
      type: {
        name: 'pst',
        type: 'registry-image',
      },
    },
  })
})

test('builds with prebuilt resource', (t) => {
  const r = new ConcourseTs.Resource('my-r', new ConcourseTs.ResourceType('my-rt'))
  const builder = new PutStepBuilder().name('my-put-step').put(r)

  const result = JSON.parse(JSON.stringify(builder.build()))

  t.deepEqual(result, {
    name: 'my-put-step',
    resource: {
      name: 'my-r',
      type: {
        name: 'my-rt',
      },
    },
  })
})
