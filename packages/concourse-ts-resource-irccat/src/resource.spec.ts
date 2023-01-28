import test from 'ava'

import { IrccatResource } from './resource'
import { IrccatResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new IrccatResourceType('my-irccat-resource_type')
  const r = new IrccatResource('my-irccat-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-irccat-resource')
})
