import test from 'ava'

import { HgResource } from './resource'
import { HgResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new HgResourceType('my-hg-resource_type')
  const r = new HgResource('my-hg-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-hg-resource')
})
