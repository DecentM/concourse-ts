import test from 'ava'

import { ConcourseTfeResource } from './resource'
import { ConcourseTfeResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new ConcourseTfeResourceType('my-concourse-tfe-resource_type')
  const r = new ConcourseTfeResource('my-concourse-tfe-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-concourse-tfe-resource')
})
