import test from 'ava'

import { AptlyCliResource } from './resource'
import { AptlyCliResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new AptlyCliResourceType('my-aptly-cli-resource_type')
  const r = new AptlyCliResource('my-aptly-cli-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-aptly-cli-resource')
})
