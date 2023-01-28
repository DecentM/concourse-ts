import test from 'ava'

import { RepoResource } from './resource'
import { RepoResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new RepoResourceType('my-repo-resource_type')
  const r = new RepoResource('my-repo-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-repo-resource')
})
