import test from 'ava'

import { SetPipelineStepBuilder } from './set-pipeline.js'

test('builds', (t) => {
  const builder = new SetPipelineStepBuilder()
    .name('my-set-pipeline-step')
    .file('pipeline.yml')
    .instance_vars({
      my_instance_var: '1',
    })
    .pipeline('self')
    .var_file('my-var-file.json')
    .vars({
      my_var: '1',
    })

  const result = JSON.parse(JSON.stringify(builder.build()))

  t.deepEqual(result, {
    file: 'pipeline.yml',
    instance_vars: {
      my_instance_var: '1',
    },
    name: 'my-set-pipeline-step',
    set_pipeline: 'self',
    var_files: ['my-var-file.json'],
    vars: {
      my_var: '1',
    },
  })
})
