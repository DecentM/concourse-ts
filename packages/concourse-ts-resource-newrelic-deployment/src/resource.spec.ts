import test from 'ava'

import { 22NewrelicDeploymentResource } from './resource'
import { 22NewrelicDeploymentResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new 22NewrelicDeploymentResourceType('my-newrelic-deployment-resource_type')
  const r = new 22NewrelicDeploymentResource('my-newrelic-deployment-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-newrelic-deployment-resource')
})
