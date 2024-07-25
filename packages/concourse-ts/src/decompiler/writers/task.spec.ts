import path from 'node:path'
import fs from 'node:fs/promises'

import test from 'ava'
import { tsImport } from 'tsx/esm/api'

import { Type } from '../../index.js'
import { Task } from '../../components/index.js'
import { Identifier } from '../../utils/index.js'

import { write_task } from './task.js'

const chain = async (name: string, input: Type.Task<Identifier, Identifier>) => {
  const code = `
    import {Task, Command} from '../../components/index.js'

    export default ${write_task(name, input)}
  `

  const tmpDir = await fs.mkdtemp(path.join(import.meta.dirname))

  let error: Error | null = null
  let result: Task | null = null

  try {
    const tmpPath = path.join(tmpDir, 'index.ts')

    await fs.writeFile(tmpPath, code, 'utf-8')

    const loaded = await tsImport(tmpPath, import.meta.url)

    result = loaded.default
  } catch (error2) {
    if (error2 instanceof Error) {
      error = error2
    }
  }

  await fs.rm(tmpDir, { recursive: true, force: true })

  return { result, error, code }
}

const default_task = {
  caches: undefined,
  container_limits: undefined,
  image_resource: {
    source: {},
    type: 'registry-image',
  },
  inputs: undefined,
  outputs: undefined,
  params: undefined,
  platform: 'linux',
  rootfs_uri: undefined,
  run: {
    args: [],
    dir: undefined,
    path: 'echo',
    user: undefined,
  },
}

test('writes empty task', async (t) => {
  const task: Type.Task<Identifier, Identifier> = {
    platform: 'linux',
    image_resource: {
      type: 'registry-image' as Identifier,
      source: {},
    },
    run: {
      path: 'echo',
      args: [],
    },
  }

  const { result, error } = await chain('a', task)

  t.is(error, null)
  t.deepEqual(result?.serialise(), default_task)
})

test('writes caches', async (t) => {
  const task: Type.Task<Identifier, Identifier> = {
    platform: 'linux',
    image_resource: {
      type: 'registry-image' as Identifier,
      source: {},
    },
    run: {
      path: 'echo',
      args: [],
    },
    caches: [{ path: 'my-cache' }],
  }

  const { result, error } = await chain('a', task)

  t.is(error, null)
  t.deepEqual(result?.serialise(), {
    ...default_task,
    caches: [{ path: 'my-cache' }],
  })
})

test('writes container_limits', async (t) => {
  const task: Type.Task<Identifier, Identifier> = {
    platform: 'linux',
    image_resource: {
      type: 'registry-image' as Identifier,
      source: {},
    },
    run: {
      path: 'echo',
      args: [],
    },
    container_limits: {
      cpu: 50,
      memory: 50_000,
    },
  }

  const { result, error } = await chain('a', task)

  t.is(error, null)
  t.deepEqual(result?.serialise(), {
    ...default_task,
    container_limits: {
      cpu: 50,
      memory: 50_000,
    },
  })
})

test('writes inputs', async (t) => {
  const task: Type.Task<Identifier, Identifier> = {
    platform: 'linux',
    image_resource: {
      type: 'registry-image' as Identifier,
      source: {},
    },
    run: {
      path: 'echo',
      args: [],
    },
    inputs: [{ name: 'my-input' as Identifier }],
  }

  const { result, error } = await chain('a', task)

  t.is(error, null)
  t.deepEqual(result?.serialise(), {
    ...default_task,
    inputs: [{ name: 'my-input' }],
  })
})

test('writes outputs', async (t) => {
  const task: Type.Task<Identifier, Identifier> = {
    platform: 'linux',
    image_resource: {
      type: 'registry-image' as Identifier,
      source: {},
    },
    run: {
      path: 'echo',
      args: [],
    },
    outputs: [{ name: 'my-output' as Identifier }],
  }

  const { result, error } = await chain('a', task)

  t.is(error, null)
  t.deepEqual(result?.serialise(), {
    ...default_task,
    outputs: [{ name: 'my-output' }],
  })
})

test('writes params', async (t) => {
  const task: Type.Task<Identifier, Identifier> = {
    platform: 'linux',
    image_resource: {
      type: 'registry-image' as Identifier,
      source: {},
    },
    run: {
      path: 'echo',
      args: [],
    },
    params: {
      my_param: '1',
    },
  }

  const { result, error } = await chain('a', task)

  t.is(error, null)
  t.deepEqual(result?.serialise(), {
    ...default_task,
    params: {
      my_param: '1',
    },
  })
})
