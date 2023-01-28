import test from 'ava'

import { Appcenter.yamlResource } from './resource'
import { Appcenter.yamlResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new Appcenter.yamlResourceType('my-appcenter.yaml-resource_type')
  const r = new Appcenter.yamlResource('my-appcenter.yaml-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-appcenter.yaml-resource')
})
