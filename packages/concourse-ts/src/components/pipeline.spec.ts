import test from 'ava'
import { Command } from './command.js'
import { Job } from './job.js'

import { Pipeline } from './pipeline.js'
import { Resource } from './resource.js'
import { ResourceType } from './resource-type.js'
import { Task } from './task.js'

const image_url = 'https://example.com/image.jpg'
const image_filter = 'blur(5px)'

const default_pipeline = {
  groups: undefined,
  jobs: [],
  resource_types: undefined,
  resources: undefined,
  var_sources: undefined,
  display: {
    background_image: image_url,
    background_filter: image_filter,
  },
}

const default_job = {
  max_in_flight: undefined,
  plan: [],
  build_log_retention: undefined,
  build_logs_to_retain: undefined,
  disable_manual_trigger: undefined,
  ensure: undefined,
  interruptible: undefined,
  old_name: undefined,
  on_abort: undefined,
  on_error: undefined,
  on_failure: undefined,
  on_success: undefined,
  public: undefined,
  serial: undefined,
  serial_groups: undefined,
}

Pipeline.customise((pipeline) => {
  pipeline.set_background_image_url(image_url)
  pipeline.set_background_filter(image_filter)
})

test('runs static customiser', (t) => {
  const pipeline = new Pipeline('a')

  t.deepEqual(pipeline.serialise(), default_pipeline)
})

test('runs instance customiser', (t) => {
  const pipeline = new Pipeline('a', (a) => {
    a.name = 'b'
  })

  t.is(pipeline.name, 'b')
})

test('stores ungrouped jobs', (t) => {
  const pipeline = new Pipeline('a')

  pipeline.add_job(new Job('aj'))

  t.deepEqual(pipeline.serialise(), {
    ...default_pipeline,
    jobs: [
      {
        ...default_job,
        name: 'aj',
      },
    ],
  })
})

test('stores grouped jobs', (t) => {
  const pipeline = new Pipeline<'ga'>('a')

  pipeline.add_job(new Job('aj0'), 'ga')
  pipeline.add_job(new Job('aj1'), 'ga')

  t.deepEqual(pipeline.serialise(), {
    ...default_pipeline,
    jobs: [
      {
        ...default_job,
        name: 'aj0',
      },
      {
        ...default_job,
        name: 'aj1',
      },
    ],
    groups: [
      {
        name: 'ga',
        jobs: ['aj0', 'aj1'],
      },
    ],
  })
})

test('stores var-sources', (t) => {
  const pipeline = new Pipeline('a')

  pipeline.add_var_source({
    name: 'vsa',
    type: 'dummy',
    config: {
      vars: {
        v1: 'var 1',
      },
    },
  })

  t.deepEqual(pipeline.serialise(), {
    ...default_pipeline,
    var_sources: [
      {
        name: 'vsa',
        type: 'dummy',
        config: {
          vars: {
            v1: 'var 1',
          },
        },
      },
    ],
  })
})

test('collects tasks', (t) => {
  const task = new Task('ajt', (ajt) => {
    ajt.set_platform('linux')

    ajt.set_run(new Command((ajtc) => {
      ajtc.set_path('echo')
      ajtc.add_args('ajtc')
    }))
  })

  const pipeline = new Pipeline('a', (a) => {
    a.add_job(
      new Job('aj', (aj) => {
        aj.add_steps(task.as_task_step())
      })
    )
  })

  const tasks = pipeline.get_tasks()

  t.deepEqual(tasks, [task])
})

test('serialises resources', (t) => {
  const rt = new ResourceType('rt', (rt) => {
    rt.set_type('registry-image')
  })

  const r = new Resource('r', rt)

  const job = new Job('aj', (aj) => {
    aj.add_steps(r.as_get_step())
  })

  const pipeline = new Pipeline('a', (a) => {
    a.add_job(job)
  })

  t.deepEqual(pipeline.serialise(), {
    ...default_pipeline,
    jobs: [job.serialise()],
    resources: [r.serialise()],
    resource_types: [rt.serialise()],
  })
})
