import test from 'ava'

import { TrackerResource } from './resource'
import { TrackerResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new TrackerResourceType('my-tracker-resource_type')
  const r = new TrackerResource('my-tracker-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-tracker-resource')
})
