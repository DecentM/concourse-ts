import test from 'ava'

import { GitResource } from './resource'
import { GitResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new GitResourceType('my-git-resource_type', {
    tag: 'alpine',
  })

  const r = new GitResource('my-git-resource', rt, {
    uri: '',
  })

  t.is(r.name, 'my-git-resource')
})
