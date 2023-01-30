import test from 'ava'

import { SlackAlertResource } from './resource'
import { SlackAlertResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new SlackAlertResourceType('my-slack-alert-resource_type')
  const r = new SlackAlertResource('my-slack-alert-resource', rt, {
    url: '',
  })

  t.is(r.name, 'my-slack-alert-resource')
})
