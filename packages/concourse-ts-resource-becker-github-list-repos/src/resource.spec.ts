import test from 'ava'

import { BeckerGithubListReposResource } from './resource'
import { BeckerGithubListReposResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new BeckerGithubListReposResourceType('my-becker-github-list-repos-resource_type')
  const r = new BeckerGithubListReposResource('my-becker-github-list-repos-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-becker-github-list-repos-resource')
})
