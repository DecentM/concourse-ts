import test from 'ava'

import { BeckerDhallResource } from './resource'
import { BeckerDhallResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new BeckerDhallResourceType('my-becker-dhall-resource_type')
  const r = new BeckerDhallResource('my-becker-dhall-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-becker-dhall-resource')
})
