import test from 'ava'
import {Identifier} from '../utils'
import {Command} from './command'
import {Resource} from './resource'
import {ResourceType} from './resource-type'

import {Task} from './task'

const default_task = {
  caches: [],
  container_limits: undefined,
  image_resource: undefined,
  inputs: undefined,
  outputs: undefined,
  params: {
    'my-param': '1',
  },
  platform: undefined,
  rootfs_uri: undefined,
  run: undefined,
}

test.beforeEach(() => {
  Task.customise((task) => {
    task.set_params({key: 'my-param', value: '1'})
  })

  Task.customise_task_step((ts) => {
    ts.add_tag('static')
  })
})

test('runs static customiser', (t) => {
  const task = new Task('a')

  t.deepEqual(task.serialise(), default_task)
})

test('runs instance customiser', (t) => {
  const task = new Task('a', (a) => {
    a.name = 'b' as Identifier
  })

  t.is(task.name, 'b' as Identifier)
})

test('runs task-step customiser', (t) => {
  const task = new Task('my-t', (my_t) => {
    my_t.customise_task_step((gs) => {
      gs.add_tag('customised')
    })
  })

  t.deepEqual(
    task
      .as_task_step((ts) => {
        ts.add_tag('instance')
      })
      .serialise(),
    {
      attempts: undefined,
      config: default_task,
      ensure: undefined,
      file: undefined,
      image: undefined,
      input_mapping: undefined,
      on_abort: undefined,
      on_error: undefined,
      on_failure: undefined,
      on_success: undefined,
      output_mapping: undefined,
      params: undefined,
      privileged: undefined,
      tags: ['static', 'customised', 'instance'],
      task: 'my-t',
      timeout: undefined,
      vars: undefined,
    }
  )
})

test('stores anonymous image resource', (t) => {
  const a = new Task('a', (a) => {
    a.set_image_resource({
      type: 'registry-image',
      source: {},
    })
  })

  t.deepEqual(a.serialise(), {
    ...default_task,
    image_resource: {
      type: 'registry-image',
      source: {},
    },
  })
})

test('stores component image resource', (t) => {
  const r = new Resource(
    'r',
    new ResourceType('rt', (rt) => {
      rt.set_type('registry-image')
    })
  )

  const a = new Task('a', (a) => {
    a.set_image_resource(r)
  })

  t.deepEqual(a.serialise(), {
    ...default_task,
    image_resource: {
      type: 'rt',
      source: undefined,
    },
  })
})

test('stores caches', (t) => {
  const task = new Task('a', (a) => {
    a.add_cache({path: 'c'})
  })

  t.deepEqual(task.serialise(), {
    ...default_task,
    caches: [{path: 'c'}],
  })
})

test('stores container limits', (t) => {
  const task = new Task('a', (a) => {
    a.set_cpu_limit_percent(50)
    a.set_memory_limit({mb: 512})
  })

  t.deepEqual(task.serialise(), {
    ...default_task,
    container_limits: {
      cpu: 50,
      memory: 512_000_000,
    },
  })
})

test('stores inputs', (t) => {
  const task = new Task('a', (a) => {
    a.add_input({name: 'ai' as Identifier})
  })

  t.deepEqual(task.serialise(), {
    ...default_task,
    inputs: [{name: 'ai'}],
  })
})

test('stores outputs', (t) => {
  const task = new Task('a', (a) => {
    a.add_output({name: 'ao' as Identifier})
  })

  t.deepEqual(task.serialise(), {
    ...default_task,
    outputs: [{name: 'ao'}],
  })
})

test('stores commands', (t) => {
  const task = new Task('a', (a) => {
    a.run = new Command('ac')
  })

  t.deepEqual(task.serialise(), {
    ...default_task,
    run: {
      args: [],
      dir: undefined,
      path: undefined,
      user: undefined,
    },
  })
})
