import test from 'ava'

import { MarathonResource } from './resource'
import { MarathonResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new MarathonResourceType('my-marathon-resource_type')
  const r = new MarathonResource('my-marathon-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-marathon-resource')
})
