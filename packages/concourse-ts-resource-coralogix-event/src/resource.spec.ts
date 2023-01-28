import test from 'ava'

import { CoralogixEventResource } from './resource'
import { CoralogixEventResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new CoralogixEventResourceType('my-coralogix-event-resource_type')
  const r = new CoralogixEventResource('my-coralogix-event-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-coralogix-event-resource')
})
