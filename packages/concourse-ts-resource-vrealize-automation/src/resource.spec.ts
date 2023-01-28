import test from 'ava'

import { VrealizeAutomationResource } from './resource'
import { VrealizeAutomationResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new VrealizeAutomationResourceType('my-vrealize-automation-resource_type')
  const r = new VrealizeAutomationResource('my-vrealize-automation-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-vrealize-automation-resource')
})
