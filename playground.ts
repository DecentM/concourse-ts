import fs from 'node:fs'
import {Job} from '~/components/job'
import {GetStep, PutStep, TaskStep} from '~/components/step'
import {with_try_catch} from '~/utils/with-try'
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
    const gs = new GetStep('myjob_get', (getStep) => {
      getStep.set_get(r)
      getStep.trigger = true
    })

    const errorStep = new PutStep('myjob_onerror', (errorStep) => {
      errorStep.set_put(r)
    })

    const ts = with_try_catch(gs, errorStep)

    const taskStep = new TaskStep('the-task-yay', (taskStep) => {
      taskStep.set_task(t)
    })

    job.add_step(ts)
    job.add_step(taskStep)
  })

  pipeline.add_job(j)
})

const compiled = compile(pipeline)
fs.writeFileSync('./playground.yml', compiled)

console.log(compiled)
