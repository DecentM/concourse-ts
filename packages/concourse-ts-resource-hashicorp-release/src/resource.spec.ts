import test from 'ava'

import { HashicorpReleaseResource } from './resource'
import { HashicorpReleaseResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new HashicorpReleaseResourceType('my-hashicorp-release-resource_type')
  const r = new HashicorpReleaseResource('my-hashicorp-release-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-hashicorp-release-resource')
})
