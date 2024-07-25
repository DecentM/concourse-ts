import test from 'ava'

import { JobBuilder } from './job.js'

test('builds job', (t) => {
  const job = new JobBuilder()
    .name('test')
    .step((s) => {
      s.do((ds) => {
        ds.name('my-do-step')
      })
    })
    .passed((s) => {
      s.name('my-get-step-passed')
    })

  const result = JSON.parse(JSON.stringify(job.build().serialise()))

  t.deepEqual(result, {
    name: 'test',
    plan: [
      { do: [] },
      {
        passed: ['test'],
      },
    ],
  })
})
