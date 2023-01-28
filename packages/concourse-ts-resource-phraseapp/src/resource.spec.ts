import test from 'ava'

import { PhraseappResource } from './resource'
import { PhraseappResourceType } from './resource-type'

test('stores name', (t) => {
  const rt = new PhraseappResourceType('my-phraseapp-resource_type')
  const r = new PhraseappResource('my-phraseapp-resource', rt, {
    // TODO: Fill this out
  })

  t.is(r.name, 'my-phraseapp-resource')
})
