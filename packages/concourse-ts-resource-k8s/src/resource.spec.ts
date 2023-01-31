import test from 'ava'

import { K8sResource } from './resource'
import { K8sResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new K8sResourceType('my-k8s-resource_type')
  const r = new K8sResource('my-k8s-resource', rt, {
    cluster_url: '',
  })

  t.is(r.name, 'my-k8s-resource')
})
