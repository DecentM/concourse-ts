import test from 'ava'

import { BitbucketPrResource } from './resource'
import { BitbucketPrResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new BitbucketPrResourceType('my-bitbucket-pr-resource_type')
  const r = new BitbucketPrResource('my-bitbucket-pr-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-bitbucket-pr-resource')
})
