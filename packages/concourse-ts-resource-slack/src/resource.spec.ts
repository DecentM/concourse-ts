import test from 'ava'

import { SlackResource } from './resource'
import { SlackResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new SlackResourceType('my-slack-resource_type')
  const r = new SlackResource('my-slack-resource', rt, {
    url: 'http://example.com',
  })

  t.is(r.name, 'my-slack-resource')
})
