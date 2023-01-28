import test from 'ava'

import { GateResource } from './resource'
import { GateResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new GateResourceType('my-gate-resource_type')
  const r = new GateResource('my-gate-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-gate-resource')
})
