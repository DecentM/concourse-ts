import test from 'ava'

import { TeamsNotificationResource } from './resource'
import { TeamsNotificationResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new TeamsNotificationResourceType('my-teams-notification-resource_type')
  const r = new TeamsNotificationResource('my-teams-notification-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-teams-notification-resource')
})
