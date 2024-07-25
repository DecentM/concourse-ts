import test from 'ava'

import { TaskStepBuilder } from './task.js'

test('builds', (t) => {
  const builder = new TaskStepBuilder()
    .name('my-task-step')
    .file('pipeline.yml')
    .vars({
      my_var: '1',
    })
    .image('alpine')
    .input_mapping('a', 'b')
    .output_mapping('b', 'a')
    .params({
      my_param: '1',
    })
    .privileged()
    .task((t) => {
      t.name('my-task')
    })

  const result = JSON.parse(JSON.stringify(builder.build()))

  t.deepEqual(result, {
    file: 'pipeline.yml',
    image: 'alpine',
    input_mapping: {
      a: 'b',
    },
    name: 'my-task-step',
    output_mapping: {
      b: 'a',
    },
    params: {
      my_param: '1',
    },
    privileged: true,
    task: {
      caches: [],
      name: 'my-task',
    },
    vars: {
      my_var: '1',
    },
  })
})
