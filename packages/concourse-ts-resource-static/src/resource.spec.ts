import test from 'ava'

import { StaticResource } from './resource'
import { StaticResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new StaticResourceType('my-static-resource_type')
  const r = new StaticResource('my-static-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-static-resource')
})
