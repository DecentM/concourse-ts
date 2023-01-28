import test from 'ava'

import { ConcourseSlackNotifierResource } from './resource'
import { ConcourseSlackNotifierResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new ConcourseSlackNotifierResourceType('my-concourse-slack-notifier-resource_type')
  const r = new ConcourseSlackNotifierResource('my-concourse-slack-notifier-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-concourse-slack-notifier-resource')
})
