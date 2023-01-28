import test from 'ava'

import { #Template#Resource } from './resource'
import { #Template#ResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new #Template#ResourceType('my-#template#-resource_type')
  const r = new #Template#Resource('my-#template#-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-#template#-resource')
})
