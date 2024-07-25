import path from 'node:path'
import fs from 'node:fs/promises'

import test from 'ava'
import { tsImport } from 'tsx/esm/api'

import { Type } from '../../index.js'
import { ResourceType } from '../../components/index.js'
import { Duration, Identifier } from '../../utils/index.js'

import { write_resource_type } from './resource-type.js'

const chain = async (name: string, pipeline: Type.Pipeline) => {
  const code = `
    import {ResourceType} from '../../components/index.js'

    export default ${write_resource_type(name, pipeline)}
  `

  const tmpDir = await fs.mkdtemp(path.join(import.meta.dirname))

  let error: Error | null = null
  let result: ResourceType | null = null

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

const default_resource_type = {
  check_every: undefined,
  defaults: undefined,
  name: 'a',
  params: undefined,
  privileged: undefined,
  tags: undefined,
}

test("throws when resource type doesn't exist in the pipeline", async (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [],
    jobs: [],
  }

  await t.throwsAsync(async () => await chain('a', pipeline), {
    any: true,
    message: 'Resource type "a" does not exist in the pipeline',
  })
})

test('throws when there are no resource_types in the pipeline', async (t) => {
  const pipeline: Type.Pipeline = {
    jobs: [],
  }

  await t.throwsAsync(async () => await chain('a', pipeline), {
    any: true,
    message: 'Resource type "a" does not exist in the pipeline',
  })
})

test('writes empty resource type', async (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [
      {
        name: 'a' as Identifier,
        type: 'registry-image' as Identifier,
        source: {},
      },
    ],
    jobs: [],
  }

  const { result, error } = await chain('a', pipeline)

  t.is(error, null)
  t.deepEqual(result?.serialise(), {
    ...default_resource_type,
    ...pipeline.resource_types![0],
    source: undefined,
  })
})

test('writes source', async (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [
      {
        name: 'a' as Identifier,
        type: 'registry-image' as Identifier,
        source: {
          repository: 'alpine',
          tag: 'latest',
        },
      },
    ],
    jobs: [],
  }

  const { result, error } = await chain('a', pipeline)

  t.is(error, null)
  t.deepEqual(result?.serialise(), {
    ...default_resource_type,
    ...pipeline.resource_types![0],
  })
})

test('writes check_every', async (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [
      {
        name: 'a' as Identifier,
        type: 'registry-image' as Identifier,
        source: {
          repository: 'alpine',
          tag: 'latest',
        },
        check_every: '1h' as Duration,
      },
    ],
    jobs: [],
  }

  const { result, error } = await chain('a', pipeline)

  t.is(error, null)
  t.deepEqual(result?.serialise(), {
    ...default_resource_type,
    ...pipeline.resource_types![0],
  })
})

test('writes defaults', async (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [
      {
        name: 'a' as Identifier,
        type: 'registry-image' as Identifier,
        source: {},
        defaults: {
          my_default: '1',
        },
      },
    ],
    jobs: [],
  }

  const { result, error } = await chain('a', pipeline)

  t.is(error, null)
  t.deepEqual(result?.serialise(), {
    ...default_resource_type,
    ...pipeline.resource_types![0],
    source: undefined,
  })
})

test('writes params', async (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [
      {
        name: 'a' as Identifier,
        type: 'registry-image' as Identifier,
        source: {},
        params: {
          my_default: '1',
        },
      },
    ],
    jobs: [],
  }

  const { result, error } = await chain('a', pipeline)

  t.is(error, null)
  t.deepEqual(result?.serialise(), {
    ...default_resource_type,
    ...pipeline.resource_types![0],
    source: undefined,
  })
})

test('writes privileged', async (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [
      {
        name: 'a' as Identifier,
        type: 'registry-image' as Identifier,
        source: {},
        privileged: true,
      },
    ],
    jobs: [],
  }

  const { result, error } = await chain('a', pipeline)

  t.is(error, null)
  t.deepEqual(result?.serialise(), {
    ...default_resource_type,
    ...pipeline.resource_types![0],
    source: undefined,
  })
})

test('writes tags', async (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [
      {
        name: 'a' as Identifier,
        type: 'registry-image' as Identifier,
        source: {},
        tags: ['tag-a', 'tag-b'],
      },
    ],
    jobs: [],
  }

  const { result, error } = await chain('a', pipeline)

  t.is(error, null)
  t.deepEqual(result?.serialise(), {
    ...default_resource_type,
    ...pipeline.resource_types![0],
    source: undefined,
  })
})
