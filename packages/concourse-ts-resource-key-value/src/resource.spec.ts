import test from 'ava'

import { KeyValueResource } from './resource'
import { KeyValueResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new KeyValueResourceType('my-key-value-resource_type')
  const r = new KeyValueResource('my-key-value-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-key-value-resource')
})
