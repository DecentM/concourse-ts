import test from 'ava'

import { RegistryImageResource } from './resource'
import { RegistryImageResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new RegistryImageResourceType('my-registry-image-resource_type')
  const r = new RegistryImageResource('my-registry-image-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-registry-image-resource')
})
