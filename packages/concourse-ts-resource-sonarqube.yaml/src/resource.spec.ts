import test from 'ava'

import { Sonarqube.yamlResource } from './resource'
import { Sonarqube.yamlResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new Sonarqube.yamlResourceType('my-sonarqube.yaml-resource_type')
  const r = new Sonarqube.yamlResource('my-sonarqube.yaml-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-sonarqube.yaml-resource')
})
