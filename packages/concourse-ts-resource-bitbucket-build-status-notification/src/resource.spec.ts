import test from 'ava'

import { BitbucketBuildStatusNotificationResource } from './resource'
import { BitbucketBuildStatusNotificationResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new BitbucketBuildStatusNotificationResourceType('my-bitbucket-build-status-notification-resource_type')
  const r = new BitbucketBuildStatusNotificationResource('my-bitbucket-build-status-notification-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-bitbucket-build-status-notification-resource')
})
