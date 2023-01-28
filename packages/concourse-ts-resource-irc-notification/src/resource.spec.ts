import test from 'ava'

import { IrcNotificationResource } from './resource'
import { IrcNotificationResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new IrcNotificationResourceType('my-irc-notification-resource_type')
  const r = new IrcNotificationResource('my-irc-notification-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-irc-notification-resource')
})
