import test from 'ava'

import { AppcenterResource } from './resource'
import { AppcenterResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new AppcenterResourceType('my-appcenter-resource_type')
  const r = new AppcenterResource('my-appcenter-resource', rt, {
    api_token: '',
    app_name: '',
    email: '',
    group_id: '',
    owner: '',
    store_id: '',
  })

  t.is(r.name, 'my-appcenter-resource')
})
