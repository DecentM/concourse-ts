import test from 'ava'

import { PaasGrafanaAnnotationResource } from './resource'
import { PaasGrafanaAnnotationResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new PaasGrafanaAnnotationResourceType('my-paas-grafana-annotation-resource_type')
  const r = new PaasGrafanaAnnotationResource('my-paas-grafana-annotation-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-paas-grafana-annotation-resource')
})
