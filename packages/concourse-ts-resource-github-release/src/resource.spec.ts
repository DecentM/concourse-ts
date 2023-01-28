import test from 'ava'

import { GithubReleaseResource } from './resource'
import { GithubReleaseResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new GithubReleaseResourceType('my-github-release-resource_type')
  const r = new GithubReleaseResource('my-github-release-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-github-release-resource')
})
