import test from 'ava'

import { Helm3Resource } from './resource'
import { Helm3ResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new Helm3ResourceType('my-helm3-resource_type')
  const r = new Helm3Resource('my-helm3-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-helm3-resource')
})
