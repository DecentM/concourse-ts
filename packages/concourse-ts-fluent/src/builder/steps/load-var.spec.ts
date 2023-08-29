import test from 'ava'

import { LoadVarStepBuilder } from './load-var'

test('builds', (t) => {
  const builder = new LoadVarStepBuilder()
    .name('my-load-var-step')
    .file('my-file')
    .format('trim')
    .load_var('my-var')
    .reveal()

  const result = JSON.parse(JSON.stringify(builder.build()))

  t.deepEqual(result, {
    file: 'my-file',
    format: 'trim',
    load_var: 'my-var',
    name: 'my-load-var-step',
    reveal: true,
  })
})
