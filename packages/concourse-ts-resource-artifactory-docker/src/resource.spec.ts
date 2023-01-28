import test from 'ava'

import { ArtifactoryDockerResource } from './resource'
import { ArtifactoryDockerResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new ArtifactoryDockerResourceType('my-artifactory-docker-resource_type')
  const r = new ArtifactoryDockerResource('my-artifactory-docker-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-artifactory-docker-resource')
})
