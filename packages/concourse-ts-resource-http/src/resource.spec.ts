import test from 'ava'

import { HttpResource } from './resource'
import { HttpResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new HttpResourceType('my-http-resource_type')
  const r = new HttpResource('my-http-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-http-resource')
})
