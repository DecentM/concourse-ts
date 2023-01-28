import test from 'ava'

import { ConcourseSlackAlertResource } from './resource'
import { ConcourseSlackAlertResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new ConcourseSlackAlertResourceType('my-concourse-slack-alert-resource_type')
  const r = new ConcourseSlackAlertResource('my-concourse-slack-alert-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-concourse-slack-alert-resource')
})
