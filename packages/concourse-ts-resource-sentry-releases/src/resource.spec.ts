import test from 'ava'

import { SentryReleasesResource } from './resource'
import { SentryReleasesResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new SentryReleasesResourceType('my-sentry-releases-resource_type')
  const r = new SentryReleasesResource('my-sentry-releases-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-sentry-releases-resource')
})
