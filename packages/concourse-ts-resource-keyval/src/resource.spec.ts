import test from 'ava'

import { KeyvalResource } from './resource'
import { KeyvalResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new KeyvalResourceType('my-keyval-resource_type')
  const r = new KeyvalResource('my-keyval-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-keyval-resource')
})
