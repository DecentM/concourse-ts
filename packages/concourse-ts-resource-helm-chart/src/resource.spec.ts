import test from 'ava'

import { HelmChartResource } from './resource'
import { HelmChartResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new HelmChartResourceType('my-helm-chart-resource_type')
  const r = new HelmChartResource('my-helm-chart-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-helm-chart-resource')
})
