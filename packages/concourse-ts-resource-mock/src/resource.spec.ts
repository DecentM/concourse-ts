import test from 'ava'

import { MockResource } from './resource'
import { MockResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new MockResourceType('my-mock-resource_type')
  const r = new MockResource('my-mock-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-mock-resource')
})
