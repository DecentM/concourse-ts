import fs from 'node:fs'
import {Job} from '~/components/job'
import {GetStep, TaskStep, TryStep} from '~/components/step'
import {Pipeline, Task, ResourceType, compile} from './src'

export const pipeline = new Pipeline((pipeline) => {
  const rt = new ResourceType('test')
  const r = rt.create_resource('test')

  pipeline.add_resource(r)

  const t = new Task('testtask', (task) => {
    task.add_input({
      name: 'testi',
      optional: false,
      path: './asd',
    })
  })

  const j = new Job('myjob', (job) => {
    const s = new GetStep((getStep) => {
      getStep.set_get(r)
      getStep.trigger = true
    })

    const ts = new TryStep((ts) => {
      ts.set_try(
        new TaskStep((ts1) => {
          ts1.set_task(t)
        })
      )
    })

    job.add_step(s)
    job.add_step(ts)
  })

  pipeline.add_job(j)

  /* pipeline.add_job({
    name: 'asd',
  }) */
})

const compiled = compile(pipeline)
fs.writeFileSync('./playground.yml', compiled)

console.log(compiled)
