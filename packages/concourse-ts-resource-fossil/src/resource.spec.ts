import test from 'ava'

import { FossilResource } from './resource'
import { FossilResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new FossilResourceType('my-fossil-resource_type')
  const r = new FossilResource('my-fossil-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-fossil-resource')
})
