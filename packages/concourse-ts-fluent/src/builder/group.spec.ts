import test from 'ava'

import { GroupBuilder } from './group.js'

test('builds group', (t) => {
  const group = new GroupBuilder().name('test').job(() => {})

  const result = JSON.parse(JSON.stringify(group.build()))

  t.deepEqual(result, {
    name: 'test',
    jobs: [
      {
        plan: [],
      },
    ],
  })
})
