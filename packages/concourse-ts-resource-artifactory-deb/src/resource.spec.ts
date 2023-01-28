import test from 'ava'

import { ArtifactoryDebResource } from './resource'
import { ArtifactoryDebResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new ArtifactoryDebResourceType('my-artifactory-deb-resource_type')
  const r = new ArtifactoryDebResource('my-artifactory-deb-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-artifactory-deb-resource')
})
