import test from 'ava'

import { ArtifactoryResource } from './resource'
import { ArtifactoryResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new ArtifactoryResourceType('my-artifactory-resource_type')
  const r = new ArtifactoryResource('my-artifactory-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-artifactory-resource')
})
