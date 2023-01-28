import test from 'ava'

import { SonarqubeResource } from './resource'
import { SonarqubeResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new SonarqubeResourceType('my-sonarqube-resource_type')
  const r = new SonarqubeResource('my-sonarqube-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-sonarqube-resource')
})
