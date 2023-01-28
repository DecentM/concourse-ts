import test from 'ava'

import { BoshIoStemcellResource } from './resource'
import { BoshIoStemcellResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new BoshIoStemcellResourceType('my-bosh-io-stemcell-resource_type')
  const r = new BoshIoStemcellResource('my-bosh-io-stemcell-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-bosh-io-stemcell-resource')
})
