import test from 'ava'

import { DockerImageResource } from './resource'
import { DockerImageResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new DockerImageResourceType('my-docker-image-resource_type')
  const r = new DockerImageResource('my-docker-image-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-docker-image-resource')
})
