import test from 'ava'

import { TryStepBuilder } from './try'

test('builds', (t) => {
  const builder = new TryStepBuilder().name('my-do-step').try((s) => {
    s.get((gs) => gs.name('my-get-step'))
  })

  const result = JSON.parse(JSON.stringify(builder.build()))

  t.deepEqual(result, {
    name: 'my-do-step',
    step: {
      name: 'my-get-step',
    },
  })
})
