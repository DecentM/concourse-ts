import test from 'ava'

import { CronResource } from './resource'
import { CronResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new CronResourceType('my-cron-resource_type')
  const r = new CronResource('my-cron-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-cron-resource')
})
