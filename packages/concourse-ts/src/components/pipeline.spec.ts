import test from 'ava'
import {Command} from './command'
import {Job} from './job'

import {Pipeline} from './pipeline'
import {Resource} from './resource'
import {ResourceType} from './resource-type'
import {Task} from './task'

const image_url = 'https://example.com/image.jpg'

const default_pipeline = {
  groups: [],
  jobs: [],
  resource_types: [],
  resources: [],
  var_sources: [],
  display: {
    background_image: image_url,
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
  serial_groups: [],
}

Pipeline.customise((pipeline) => {
  pipeline.set_background_image_url(image_url)
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
    ajt.platform = 'linux'

    ajt.run = new Command('ajtc', (ajtc) => {
      ajtc.path = 'echo'
      ajtc.add_arg('ajtc')
    })
  })

  const pipeline = new Pipeline('a', (a) => {
    a.add_job(
      new Job('aj', (aj) => {
        aj.add_step(task.as_task_step())
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
    aj.add_step(r.as_get_step())
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
