import test from 'ava'

import { TanzuObservabilityEventResource } from './resource'
import { TanzuObservabilityEventResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new TanzuObservabilityEventResourceType('my-tanzu-observability-event-resource_type')
  const r = new TanzuObservabilityEventResource('my-tanzu-observability-event-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-tanzu-observability-event-resource')
})
