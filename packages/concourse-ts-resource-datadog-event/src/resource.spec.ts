import test from 'ava'

import { DatadogEventResource } from './resource'
import { DatadogEventResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new DatadogEventResourceType('my-datadog-event-resource_type')
  const r = new DatadogEventResource('my-datadog-event-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-datadog-event-resource')
})
