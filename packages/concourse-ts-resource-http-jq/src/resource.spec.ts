import test from 'ava'

import { HttpJqResource } from './resource'
import { HttpJqResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new HttpJqResourceType('my-http-jq-resource_type')
  const r = new HttpJqResource('my-http-jq-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-http-jq-resource')
})
