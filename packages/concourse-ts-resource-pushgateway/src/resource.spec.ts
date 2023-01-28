import test from 'ava'

import { PushgatewayResource } from './resource'
import { PushgatewayResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new PushgatewayResourceType('my-pushgateway-resource_type')
  const r = new PushgatewayResource('my-pushgateway-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-pushgateway-resource')
})
