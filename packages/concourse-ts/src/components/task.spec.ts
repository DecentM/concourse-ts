import test from 'ava'
import { Command } from './command.js'
import { Resource } from './resource.js'
import { ResourceType } from './resource-type.js'

import { Task } from './task.js'
import { default_task, default_task_step } from './step/test-data/default-steps.js'

test('runs static customiser', (t) => {
  Task.customise((task) => {
    task.set_params({ 'my-param': '1' })
  })

  const task = new Task('a')

  t.deepEqual(task.serialise(), {
    ...default_task,
    params: {
      'my-param': '1',
    },
  })

  Task.customise(() => null)
})

test('runs instance customiser', (t) => {
  const task = new Task('a', (a) => {
    a.name = 'b'
  })

  t.is(task.name, 'b')
})

test('runs task-step customiser', (t) => {
  Task.customise_task_step((ts) => {
    ts.add_tag('static')
  })

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
      ...default_task_step,
      config: default_task,
      tags: ['static', 'customised', 'instance'],
      task: 'my-t',
    }
  )

  Task.customise_task_step(() => null)
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
      version: undefined,
    },
  })
})

test('stores caches', (t) => {
  const task = new Task('a', (a) => {
    a.add_cache({ path: 'c' })
  })

  t.deepEqual(task.serialise(), {
    ...default_task,
    caches: [{ path: 'c' }],
  })
})

test('stores container limits', (t) => {
  const task = new Task('a', (a) => {
    a.set_cpu_limit_shares(50)
    a.set_memory_limit({ mb: 512 })
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
    a.add_input({ name: 'ai' })
  })

  t.deepEqual(task.serialise(), {
    ...default_task,
    inputs: [{ name: 'ai' }],
  })
})

test('stores outputs', (t) => {
  const task = new Task('a', (a) => {
    a.add_output({ name: 'ao' })
  })

  t.deepEqual(task.serialise(), {
    ...default_task,
    outputs: [{ name: 'ao' }],
  })
})

test('stores commands', (t) => {
  const task = new Task('a', (a) => {
    a.run = new Command()
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
