import test from 'ava'

import { DockerComposeResource } from './resource'
import { DockerComposeResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new DockerComposeResourceType('my-docker-compose-resource_type')
  const r = new DockerComposeResource('my-docker-compose-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-docker-compose-resource')
})
