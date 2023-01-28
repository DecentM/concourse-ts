import test from 'ava'

import { CapistranoResource } from './resource'
import { CapistranoResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new CapistranoResourceType('my-capistrano-resource_type')
  const r = new CapistranoResource('my-capistrano-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-capistrano-resource')
})
