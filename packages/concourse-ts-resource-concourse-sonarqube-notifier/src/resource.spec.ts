import test from 'ava'

import { ConcourseSonarqubeNotifierResource } from './resource'
import { ConcourseSonarqubeNotifierResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new ConcourseSonarqubeNotifierResourceType('my-concourse-sonarqube-notifier-resource_type')
  const r = new ConcourseSonarqubeNotifierResource('my-concourse-sonarqube-notifier-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-concourse-sonarqube-notifier-resource')
})
