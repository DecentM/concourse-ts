import test from 'ava'

import { OssGithubPrResource } from './resource'
import { OssGithubPrResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new OssGithubPrResourceType('my-oss-github-pr-resource_type')
  const r = new OssGithubPrResource('my-oss-github-pr-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-oss-github-pr-resource')
})
