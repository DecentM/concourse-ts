import test from 'ava'

import { OpensslSourceCodeResource } from './resource'
import { OpensslSourceCodeResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new OpensslSourceCodeResourceType('my-openssl-source-code-resource_type')
  const r = new OpensslSourceCodeResource('my-openssl-source-code-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-openssl-source-code-resource')
})
