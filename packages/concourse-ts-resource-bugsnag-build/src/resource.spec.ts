import test from 'ava'

import { BugsnagBuildResource } from './resource'
import { BugsnagBuildResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new BugsnagBuildResourceType('my-bugsnag-build-resource_type')
  const r = new BugsnagBuildResource('my-bugsnag-build-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-bugsnag-build-resource')
})
