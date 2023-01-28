import test from 'ava'

import { ConcourseBlackduckResource } from './resource'
import { ConcourseBlackduckResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new ConcourseBlackduckResourceType('my-concourse-blackduck-resource_type')
  const r = new ConcourseBlackduckResource('my-concourse-blackduck-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-concourse-blackduck-resource')
})
