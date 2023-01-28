import test from 'ava'

import { VasuK8sResource } from './resource'
import { VasuK8sResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new VasuK8sResourceType('my-vasu-k8s-resource_type')
  const r = new VasuK8sResource('my-vasu-k8s-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-vasu-k8s-resource')
})
