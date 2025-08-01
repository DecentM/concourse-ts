import path from 'node:path'
import fs from 'node:fs/promises'

import test from 'ava'
import { tsImport } from 'tsx/esm/api'

import { Type } from '../../../index.js'
import { Identifier } from '../../../utils/index.js'

import { write_put_step } from './put.js'
import { default_put_step } from '../../../components/step/test-data/default-steps.js'

const chain = async (name: string, input: Type.PutStep, pipeline: Type.Pipeline) => {
  const code = `
    import {PutStep, Resource, ResourceType} from '../../../components/index.js'

    export default ${write_put_step(name, input, pipeline)}
  `

  const tmpDir = await fs.mkdtemp(path.join(import.meta.dirname))
  const tmpPath = path.join(tmpDir, 'step.ts')

  await fs.writeFile(tmpPath, code, 'utf-8')

  try {
    const loaded = await tsImport(tmpPath, import.meta.url)

    return { result: loaded.default, code }
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true })
  }
}

const default_pipeline: Type.Pipeline = {
  resource_types: [
    {
      name: 'at' as Identifier,
      type: 'registry-image' as Identifier,
      source: {},
    },
  ],
  resources: [
    {
      name: 'a' as Identifier,
      type: 'at' as Identifier,
      source: {},
    },
  ],
  jobs: [],
}

test('writes empty step', async (t) => {
  const { result } = await chain('a', { put: 'a' as Identifier }, default_pipeline)

  t.deepEqual(result?.serialise(), {
    ...default_put_step,
    put: 'a',
  })
})

test('writes empty step from alias', async (t) => {
  const { result } = await chain(
    'a',
    { put: 'b' as Identifier, resource: 'a' as Identifier },
    default_pipeline
  )

  t.deepEqual(result?.serialise(), {
    ...default_put_step,
    put: 'a',
  })
})

test('writes inputs', async (t) => {
  const { result } = await chain(
    'a',
    { put: 'a' as Identifier, inputs: 'detect' },
    default_pipeline
  )

  t.deepEqual(result?.serialise(), {
    ...default_put_step,
    put: 'a',
    inputs: 'detect',
  })
})

test('writes params', async (t) => {
  const { result } = await chain(
    'a',
    { put: 'a' as Identifier, params: { my_param: '1' } },
    default_pipeline
  )

  t.deepEqual(result?.serialise(), {
    ...default_put_step,
    put: 'a',
    params: {
      my_param: '1',
    },
  })
})

test('writes get_params', async (t) => {
  const { result } = await chain(
    'a',
    { put: 'a' as Identifier, get_params: { my_param: '1' } },
    default_pipeline
  )

  t.deepEqual(result?.serialise(), {
    ...default_put_step,
    put: 'a',
    get_params: {
      my_param: '1',
    },
  })
})

test('writes no_get', async (t) => {
  const { result } = await chain(
    'a',
    { put: 'a' as Identifier, no_get: true },
    default_pipeline
  )

  t.deepEqual(result?.serialise(), {
    ...default_put_step,
    put: 'a',
    no_get: true,
  })
})
