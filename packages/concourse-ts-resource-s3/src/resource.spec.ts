import test from 'ava'

import { S3Resource } from './resource'
import { S3ResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new S3ResourceType('my-s3-resource_type')
  const r = new S3Resource('my-s3-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-s3-resource')
})
