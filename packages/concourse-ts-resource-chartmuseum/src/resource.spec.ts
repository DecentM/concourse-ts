import test from 'ava'

import { ChartmuseumResource } from './resource'
import { ChartmuseumResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new ChartmuseumResourceType('my-chartmuseum-resource_type')
  const r = new ChartmuseumResource('my-chartmuseum-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-chartmuseum-resource')
})
