import test from 'ava'

import { RubygemsResource } from './resource'
import { RubygemsResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new RubygemsResourceType('my-rubygems-resource_type')
  const r = new RubygemsResource('my-rubygems-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-rubygems-resource')
})
