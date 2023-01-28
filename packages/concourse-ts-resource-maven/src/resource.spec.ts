import test from 'ava'

import { MavenResource } from './resource'
import { MavenResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new MavenResourceType('my-maven-resource_type')
  const r = new MavenResource('my-maven-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-maven-resource')
})
