import test from 'ava'

import { CogitoResource } from './resource'
import { CogitoResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new CogitoResourceType('my-cogito-resource_type')
  const r = new CogitoResource('my-cogito-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-cogito-resource')
})
