import test from 'ava'

import { Incident.yamlResource } from './resource'
import { Incident.yamlResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new Incident.yamlResourceType('my-incident.yaml-resource_type')
  const r = new Incident.yamlResource('my-incident.yaml-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-incident.yaml-resource')
})
