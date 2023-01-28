import test from 'ava'

import { RocketchatNotificationResource } from './resource'
import { RocketchatNotificationResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new RocketchatNotificationResourceType('my-rocketchat-notification-resource_type')
  const r = new RocketchatNotificationResource('my-rocketchat-notification-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-rocketchat-notification-resource')
})
