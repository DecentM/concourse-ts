import test from 'ava'

import { TaskBuilder } from './task'

test('builds', (t) => {
  const builder = new TaskBuilder()
    .name('my-task')
    .image_resource({
      type: 'registry-image',
      source: {},
    })
    .cache({
      path: 'cache',
    })
    .cpu_limit_shares(1)
    .input({
      name: 'my-input',
    })
    .memory_limit({
      mb: 512,
    })
    .output({
      name: 'my-output',
    })
    .params({
      my_param: '1',
    })
    .platform('linux')
    .rootfs_uri('my-rootfs-uri')
    .run(() => {})

  const result = JSON.parse(JSON.stringify(builder.build().serialise()))

  t.deepEqual(result, {
    image_resource: {
      type: 'registry-image',
      source: {},
    },
    inputs: [
      {
        name: 'my-input',
      },
    ],
    outputs: [
      {
        name: 'my-output',
      },
    ],
    params: {
      my_param: '1',
    },
    platform: 'linux',
    rootfs_uri: 'my-rootfs-uri',
    run: {
      args: [],
    },
    caches: [
      {
        path: 'cache',
      },
    ],
    container_limits: {
      cpu: 1,
      memory: 512000000,
    },
  })
})
