import test from 'ava'

import { ConsulKvResource } from './resource'
import { ConsulKvResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new ConsulKvResourceType('my-consul-kv-resource_type')
  const r = new ConsulKvResource('my-consul-kv-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-consul-kv-resource')
})
