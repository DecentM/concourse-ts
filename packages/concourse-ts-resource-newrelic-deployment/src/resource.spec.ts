import test from 'ava'

import { NewrelicDeploymentResource } from './resource'
import { NewrelicDeploymentResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new NewrelicDeploymentResourceType(
    'my-newrelic-deployment-resource_type'
  )
  const r = new NewrelicDeploymentResource('my-newrelic-deployment-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-newrelic-deployment-resource')
})
