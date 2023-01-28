import test from 'ava'

import { PulumiResource } from './resource'
import { PulumiResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new PulumiResourceType('my-pulumi-resource_type')
  const r = new PulumiResource('my-pulumi-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-pulumi-resource')
})
