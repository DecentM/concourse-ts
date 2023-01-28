import test from 'ava'

import { GcsResource } from './resource'
import { GcsResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new GcsResourceType('my-gcs-resource_type')
  const r = new GcsResource('my-gcs-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-gcs-resource')
})
