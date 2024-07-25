import path from 'node:path'
import fs from 'node:fs/promises'

import test from 'ava'

import { Type } from '../../index.js'
import { Resource } from '../../components/index.js'
import { Duration, Identifier } from '../../utils/index.js'

import { write_resource } from './resource.js'
import { tsImport } from 'tsx/esm/api'

const chain = async (name: string, pipeline: Type.Pipeline) => {
  const code = `
    import {Resource, ResourceType} from '../../components/index.js'

    export default ${write_resource(name, pipeline)}
  `

  const tmpDir = await fs.mkdtemp(path.join(import.meta.dirname))

  let error: Error | null = null
  let result: Resource | null = null

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

const default_resource = {
  check_every: undefined,
  icon: undefined,
  name: 'a',
  old_name: undefined,
  public: undefined,
  source: undefined,
  tags: undefined,
  type: 'at',
  version: undefined,
  webhook_token: undefined,
}

const resource_type = {
  name: 'at' as Identifier,
  type: 'registry-image' as Identifier,
  source: {},
  defaults: {
    my_default: '1',
  },
}

test('writes empty resource', async (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [resource_type],
    resources: [
      {
        name: 'a' as Identifier,
        type: 'at' as Identifier,
        source: {},
      },
    ],
    jobs: [],
  }

  const { result, error } = await chain('a', pipeline)

  t.is(error, null)
  t.deepEqual(result?.serialise(), {
    ...default_resource,
    ...pipeline.resources![0],
    source: undefined,
  })
})

test("throws if the resource doesn't exist", async (t) => {
  const pipeline: Type.Pipeline = {
    jobs: [],
  }

  await t.throwsAsync(
    async () => {
      await chain('a', pipeline)
    },
    {
      any: true,
      message: 'Resource "a" does not exist in the pipeline',
    }
  )
})

test('writes source', async (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [resource_type],
    resources: [
      {
        name: 'a' as Identifier,
        type: 'at' as Identifier,
        source: {
          a: 1,
        },
      },
    ],
    jobs: [],
  }

  const { result, error } = await chain('a', pipeline)

  t.is(error, null)
  t.deepEqual(result?.serialise(), {
    ...default_resource,
    ...pipeline.resources![0],
    source: { a: 1 },
  })
})

test('writes check_every', async (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [resource_type],
    resources: [
      {
        name: 'a' as Identifier,
        type: 'at' as Identifier,
        source: {},
        check_every: '1h' as Duration,
      },
    ],
    jobs: [],
  }

  const { result, error } = await chain('a', pipeline)

  t.is(error, null)
  t.deepEqual(result?.serialise(), {
    ...default_resource,
    ...pipeline.resources![0],
    source: undefined,
    check_every: '1h',
  })
})

test('writes icon', async (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [resource_type],
    resources: [
      {
        name: 'a' as Identifier,
        type: 'at' as Identifier,
        source: {},
        icon: 'check',
      },
    ],
    jobs: [],
  }

  const { result, error } = await chain('a', pipeline)

  t.is(error, null)
  t.deepEqual(result?.serialise(), {
    ...default_resource,
    ...pipeline.resources![0],
    source: undefined,
    icon: 'check',
  })
})

test('writes old_name', async (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [resource_type],
    resources: [
      {
        name: 'a' as Identifier,
        type: 'at' as Identifier,
        source: {},
        old_name: 'aon' as Identifier,
      },
    ],
    jobs: [],
  }

  const { result, error } = await chain('a', pipeline)

  t.is(error, null)
  t.deepEqual(result?.serialise(), {
    ...default_resource,
    ...pipeline.resources![0],
    source: undefined,
    old_name: 'aon',
  })
})

test('writes public', async (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [resource_type],
    resources: [
      {
        name: 'a' as Identifier,
        type: 'at' as Identifier,
        source: {},
        public: false,
      },
    ],
    jobs: [],
  }

  const { result, error } = await chain('a', pipeline)

  t.is(error, null)
  t.deepEqual(result?.serialise(), {
    ...default_resource,
    ...pipeline.resources![0],
    source: undefined,
    public: false,
  })
})

test('writes tags', async (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [resource_type],
    resources: [
      {
        name: 'a' as Identifier,
        type: 'at' as Identifier,
        source: {},
        tags: ['tag-a', 'tag-b'],
      },
    ],
    jobs: [],
  }

  const { result, error } = await chain('a', pipeline)

  t.is(error, null)
  t.deepEqual(result?.serialise(), {
    ...default_resource,
    ...pipeline.resources![0],
    source: undefined,
    tags: ['tag-a', 'tag-b'],
  })
})

test('writes version', async (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [resource_type],
    resources: [
      {
        name: 'a' as Identifier,
        type: 'at' as Identifier,
        source: {},
        version: 'every',
      },
    ],
    jobs: [],
  }

  const { result, error } = await chain('a', pipeline)

  t.is(error, null)
  t.deepEqual(result?.serialise(), {
    ...default_resource,
    ...pipeline.resources![0],
    source: undefined,
    version: 'every',
  })
})

test('writes webhook_token', async (t) => {
  const pipeline: Type.Pipeline = {
    resource_types: [resource_type],
    resources: [
      {
        name: 'a' as Identifier,
        type: 'at' as Identifier,
        source: {},
        webhook_token: 'asdasd',
      },
    ],
    jobs: [],
  }

  const { result, error } = await chain('a', pipeline)

  t.is(error, null)
  t.deepEqual(result?.serialise(), {
    ...default_resource,
    ...pipeline.resources![0],
    source: undefined,
    webhook_token: 'asdasd',
  })
})
