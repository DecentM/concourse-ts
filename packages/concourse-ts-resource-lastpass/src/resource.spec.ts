import test from 'ava'

import { LastpassResource } from './resource'
import { LastpassResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new LastpassResourceType('my-lastpass-resource_type')
  const r = new LastpassResource('my-lastpass-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-lastpass-resource')
})
