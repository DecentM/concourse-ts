import test from 'ava'

import { Kubectl_resourceResource } from './resource'
import { Kubectl_resourceResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new Kubectl_resourceResourceType('my-kubectl_resource-resource_type')
  const r = new Kubectl_resourceResource('my-kubectl_resource-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-kubectl_resource-resource')
})
