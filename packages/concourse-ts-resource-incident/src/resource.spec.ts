import test from 'ava'

import { IncidentResource } from './resource'
import { IncidentResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new IncidentResourceType('my-incident-resource_type')
  const r = new IncidentResource('my-incident-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-incident-resource')
})
