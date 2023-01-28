import test from 'ava'

import { WechatNotificationResource } from './resource'
import { WechatNotificationResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new WechatNotificationResourceType('my-wechat-notification-resource_type')
  const r = new WechatNotificationResource('my-wechat-notification-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-wechat-notification-resource')
})
