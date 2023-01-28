import test from 'ava'

import { RssResource } from './resource'
import { RssResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new RssResourceType('my-rss-resource_type')
  const r = new RssResource('my-rss-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-rss-resource')
})
