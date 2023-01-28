import test from 'ava'

import { ApacheDirectoryIndexResource } from './resource'
import { ApacheDirectoryIndexResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new ApacheDirectoryIndexResourceType('my-apache-directory-index-resource_type')
  const r = new ApacheDirectoryIndexResource('my-apache-directory-index-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-apache-directory-index-resource')
})
