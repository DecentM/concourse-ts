import test from 'ava'

import { SteampipeResource } from './resource'
import { SteampipeResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new SteampipeResourceType('my-steampipe-resource_type')
  const r = new SteampipeResource('my-steampipe-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-steampipe-resource')
})
