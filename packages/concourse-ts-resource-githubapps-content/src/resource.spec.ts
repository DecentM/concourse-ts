import test from 'ava'

import { GithubappsContentResource } from './resource'
import { GithubappsContentResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new GithubappsContentResourceType('my-githubapps-content-resource_type')
  const r = new GithubappsContentResource('my-githubapps-content-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-githubapps-content-resource')
})
