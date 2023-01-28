import test from 'ava'

import { CfResource } from './resource'
import { CfResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new CfResourceType('my-cf-resource_type')
  const r = new CfResource('my-cf-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-cf-resource')
})
