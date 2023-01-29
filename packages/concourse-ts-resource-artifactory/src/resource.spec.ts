import test from 'ava'

import { ArtifactoryResource } from './resource'
import { ArtifactoryResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new ArtifactoryResourceType('my-artifactory-resource_type', {
    tag: '0.0.18-SNAPSHOT',
  })

  const r = new ArtifactoryResource('my-artifactory-resource', rt, {
    build_name: '',
    password: '',
    uri: '',
    username: '',
  })

  t.is(r.name, 'my-artifactory-resource')
})
