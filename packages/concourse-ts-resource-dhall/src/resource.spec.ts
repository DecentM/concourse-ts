import test from 'ava'

import { DhallResource } from './resource'
import { DhallResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new DhallResourceType('my-dhall-resource_type', {
    tag: 'v1.32.0',
  })

  const r = new DhallResource('my-dhall-resource', rt, {
    expression: '',
  })

  t.is(r.name, 'my-dhall-resource')
})
