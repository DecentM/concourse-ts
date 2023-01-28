import test from 'ava'

import { GithubAppTokenResource } from './resource'
import { GithubAppTokenResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new GithubAppTokenResourceType('my-github-app-token-resource_type')
  const r = new GithubAppTokenResource('my-github-app-token-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-github-app-token-resource')
})
