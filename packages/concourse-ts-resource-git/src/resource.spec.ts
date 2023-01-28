import test from 'ava'

import { GitResource } from './resource'
import { GitResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new GitResourceType('my-git-resource_type')
  const r = new GitResource('my-git-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-git-resource')
})
