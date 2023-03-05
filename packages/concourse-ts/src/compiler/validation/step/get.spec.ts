import test from 'ava'

import {
  Command,
  Job,
  Pipeline,
  Resource,
  ResourceType,
  Task,
} from '../../../components'

import {validate_get_steps} from './get'

test.beforeEach(() => {
  ResourceType.customise((rt) => {
    rt.type = 'registry-image'
  })
})

const rt = new ResourceType('rt')
const r = new Resource('r', rt, (r) => {
  r.source = {
    repository: 'alpine',
    tag: 'latest',
  }
})

const dummy_task = new Task('task', (task) => {
  task.platform = 'linux'
  task.set_image_resource(r)
  task.run = new Command('task-run', (command) => {
    command.path = '/bin/sh'
    command.add_arg('-exuc')
    command.add_arg('echo "Hello, world!"')
  })
})

test('validates happy path', (t) => {
  const pipeline = new Pipeline('p', (pipeline) => {
    const job1 = new Job('j1', (job) => {
      job.add_step(r.as_get_step())
    })

    pipeline.add_job(job1)

    const job2 = new Job('j2', (job) => {
      const gs = r.as_get_step({
        passed: [job1],
      })

      job.add_step(gs)
    })

    pipeline.add_job(job2)
  })

  const warnings = validate_get_steps(pipeline.serialise())

  t.deepEqual(warnings.get_warnings(), [])
})

test('does not allow "passed" when a job doesn\'t use it', (t) => {
  const rt = new ResourceType('rt')
  const r = new Resource('r', rt)

  const pipeline = new Pipeline('p', (pipeline) => {
    const job1 = new Job('j1', (job) => {
      job.add_step(dummy_task.as_task_step())
    })

    pipeline.add_job(job1)

    const job2 = new Job('j2', (job) => {
      const gs = r.as_get_step({
        passed: [job1],
      })

      job.add_step(gs)
    })

    pipeline.add_job(job2)
  })

  const warnings = validate_get_steps(pipeline.serialise())

  t.deepEqual(
    warnings.get_warnings().map((warning) => warning.messages.join(', ')),
    ['Job "j1" does not interact with resource "r"']
  )
})
