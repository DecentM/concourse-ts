import test from 'ava'

import { DatetimeVersionResource } from './resource'
import { DatetimeVersionResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new DatetimeVersionResourceType('my-datetime-version-resource_type')
  const r = new DatetimeVersionResource('my-datetime-version-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-datetime-version-resource')
})
