import test from 'ava'

import { WebhookNotificationResource } from './resource'
import { WebhookNotificationResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new WebhookNotificationResourceType('my-webhook-notification-resource_type')
  const r = new WebhookNotificationResource('my-webhook-notification-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-webhook-notification-resource')
})
