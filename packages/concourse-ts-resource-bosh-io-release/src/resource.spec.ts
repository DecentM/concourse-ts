import test from 'ava'

import { BoshIoReleaseResource } from './resource'
import { BoshIoReleaseResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new BoshIoReleaseResourceType('my-bosh-io-release-resource_type')
  const r = new BoshIoReleaseResource('my-bosh-io-release-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-bosh-io-release-resource')
})
