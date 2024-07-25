import test from 'ava'

import { InParallelStepBuilder } from './in-parallel.js'

test('builds', (t) => {
  const builder = new InParallelStepBuilder()
    .name('my-in-parallel-step')
    .limit(1)
    .fail_fast()
    .in_parallel((s) => {
      s.do((ds) => {
        ds.name('my-do-step')
      })
    })

  const result = JSON.parse(JSON.stringify(builder.build()))

  t.deepEqual(result, {
    fail_fast: true,
    limit: 1,
    name: 'my-in-parallel-step',
    steps: [
      {
        do: [],
        name: 'my-do-step',
      },
    ],
  })
})
