import path from 'node:path'
import fs from 'node:fs/promises'

import test from 'ava'

import { Type } from '../../../index.js'
import { Identifier } from '../../../utils/index.js'

import { write_get_step } from './get.js'
import { default_get_step } from '../../../components/step/test-data/default-steps.js'
import { tsImport } from 'tsx/esm/api'

const chain = async (name: string, input: Type.GetStep, pipeline: Type.Pipeline) => {
  const code = `
    import {GetStep, Resource, ResourceType} from '../../../components/index.js'

    export default ${write_get_step(name, input, pipeline)}
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
  const { result } = await chain('a', { get: 'a' as Identifier }, default_pipeline)

  t.deepEqual(result?.serialise(), { ...default_get_step, get: 'a' })
})

test('writes empty step from resource property', async (t) => {
  const { result } = await chain(
    'a',
    { get: 'b' as Identifier, resource: 'a' as Identifier },
    default_pipeline
  )

  t.deepEqual(result?.serialise(), { ...default_get_step, get: 'a' })
})

test('writes passed', async (t) => {
  const { result } = await chain(
    'a',
    { get: 'a' as Identifier, passed: ['step-a', 'step-b'] as Identifier[] },
    default_pipeline
  )

  t.deepEqual(result?.serialise(), {
    ...default_get_step,
    get: 'a',
    passed: ['step-a', 'step-b'],
  })
})

test('writes params', async (t) => {
  const { result } = await chain(
    'a',
    { get: 'a' as Identifier, params: { my_param: '1' } },
    default_pipeline
  )

  t.deepEqual(result?.serialise(), {
    ...default_get_step,
    get: 'a',
    params: { my_param: '1' },
  })
})

test('writes trigger', async (t) => {
  const { result } = await chain(
    'a',
    { get: 'a' as Identifier, trigger: true },
    default_pipeline
  )

  t.deepEqual(result?.serialise(), { ...default_get_step, get: 'a', trigger: true })
})

test('writes version', async (t) => {
  const { result } = await chain(
    'a',
    { get: 'a' as Identifier, version: 'latest' },
    default_pipeline
  )

  t.deepEqual(result?.serialise(), {
    ...default_get_step,
    get: 'a',
    version: 'latest',
  })
})
