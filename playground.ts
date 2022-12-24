import fs from 'node:fs'
import {Job} from '~/components/job'
import {Pipeline, Task, Resource, ResourceType, compile} from './src'

export const pipeline = new Pipeline((pipeline) => {
  const rt = new ResourceType('test')
  const r = rt.create_resource('test')

  pipeline.add_resource(r)

  const t = new Task((task) => {
    task.add_input({
      name: 'testi',
      optional: false,
      path: './asd',
    })
  })

  const j = new Job('myjob', (job) => {
    job.add_step({
      get: 'registry-image',
      attempts: 1,
    })
  })

  pipeline.add_job(j)

  /* pipeline.add_job({
    name: 'asd',
  }) */
})

const compiled = compile(pipeline)
fs.writeFileSync('./playground.yml', compiled)

console.log(compiled)
