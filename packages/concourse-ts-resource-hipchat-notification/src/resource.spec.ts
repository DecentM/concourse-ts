import test from 'ava'

import { HipchatNotificationResource } from './resource'
import { HipchatNotificationResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new HipchatNotificationResourceType('my-hipchat-notification-resource_type')
  const r = new HipchatNotificationResource('my-hipchat-notification-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-hipchat-notification-resource')
})
