import test from 'ava'

import { ConcourseRcloneResource } from './resource'
import { ConcourseRcloneResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new ConcourseRcloneResourceType('my-concourse-rclone-resource_type')
  const r = new ConcourseRcloneResource('my-concourse-rclone-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-concourse-rclone-resource')
})
