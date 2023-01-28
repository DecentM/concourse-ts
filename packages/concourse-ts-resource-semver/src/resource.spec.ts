import test from 'ava'

import { SemverResource } from './resource'
import { SemverResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new SemverResourceType('my-semver-resource_type')
  const r = new SemverResource('my-semver-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-semver-resource')
})
