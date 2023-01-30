import test from 'ava'

import { TimeResource } from './resource'
import { TimeResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new TimeResourceType('my-time-resource_type')
  const r = new TimeResource('my-time-resource', rt, {
    interval: '5m',
  })

  t.is(r.name, 'my-time-resource')
})
