import test from 'ava'

import { ArtifacthubResource } from './resource'
import { ArtifacthubResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new ArtifacthubResourceType('my-artifacthub-resource_type')
  const r = new ArtifacthubResource('my-artifacthub-resource', rt, {
    package_name: '',
    repository_name: '',
    api_key: '',
  })

  t.is(r.name, 'my-artifacthub-resource')
})
