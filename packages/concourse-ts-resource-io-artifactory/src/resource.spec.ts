import test from 'ava'

import { IoArtifactoryResource } from './resource'
import { IoArtifactoryResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new IoArtifactoryResourceType('my-io-artifactory-resource_type')
  const r = new IoArtifactoryResource('my-io-artifactory-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-io-artifactory-resource')
})
