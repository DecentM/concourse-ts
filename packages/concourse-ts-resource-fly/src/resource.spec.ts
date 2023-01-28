import test from 'ava'

import { FlyResource } from './resource'
import { FlyResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new FlyResourceType('my-fly-resource_type')
  const r = new FlyResource('my-fly-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-fly-resource')
})
