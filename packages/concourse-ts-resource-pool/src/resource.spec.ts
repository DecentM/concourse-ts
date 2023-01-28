import test from 'ava'

import { PoolResource } from './resource'
import { PoolResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new PoolResourceType('my-pool-resource_type')
  const r = new PoolResource('my-pool-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-pool-resource')
})
