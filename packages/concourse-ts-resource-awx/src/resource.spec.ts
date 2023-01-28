import test from 'ava'

import { AwxResource } from './resource'
import { AwxResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new AwxResourceType('my-awx-resource_type')
  const r = new AwxResource('my-awx-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-awx-resource')
})
