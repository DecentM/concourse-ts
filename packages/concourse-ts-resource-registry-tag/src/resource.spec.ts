import test from 'ava'

import { RegistryTagResource } from './resource'
import { RegistryTagResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new RegistryTagResourceType('my-registry-tag-resource_type')
  const r = new RegistryTagResource('my-registry-tag-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-registry-tag-resource')
})
