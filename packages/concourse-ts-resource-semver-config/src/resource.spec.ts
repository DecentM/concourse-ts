import test from 'ava'

import { SemverConfigResource } from './resource'
import { SemverConfigResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new SemverConfigResourceType('my-semver-config-resource_type')
  const r = new SemverConfigResource('my-semver-config-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-semver-config-resource')
})
