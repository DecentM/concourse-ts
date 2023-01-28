import test from 'ava'

import { TerraformResource } from './resource'
import { TerraformResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new TerraformResourceType('my-terraform-resource_type')
  const r = new TerraformResource('my-terraform-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-terraform-resource')
})
