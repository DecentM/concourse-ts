import test from 'ava'

import { CfCliResource } from './resource'
import { CfCliResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new CfCliResourceType('my-cf-cli-resource_type')
  const r = new CfCliResource('my-cf-cli-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-cf-cli-resource')
})
