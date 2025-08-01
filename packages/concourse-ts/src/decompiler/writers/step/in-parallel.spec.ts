import path from 'node:path'
import fs from 'node:fs/promises'

import test from 'ava'
import { tsImport } from 'tsx/esm/api'

import { Type } from '../../../index.js'

import { write_in_parallel_step } from './in-parallel.js'
import { default_in_parallel_step } from '../../../components/step/test-data/default-steps.js'

const chain = async (
  name: string,
  input: Type.InParallelStep,
  pipeline: Type.Pipeline
) => {
  const code = `
    import {InParallelStep} from '../../../components/index.js'

    export default ${write_in_parallel_step(name, input, pipeline)}
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
  jobs: [],
}

test('writes empty step', async (t) => {
  const { result } = await chain('a', { in_parallel: [] }, default_pipeline)

  t.deepEqual(result?.serialise(), default_in_parallel_step)
})

test('writes steps', async (t) => {
  const { result } = await chain(
    'a',
    { in_parallel: { steps: [default_in_parallel_step] } },
    default_pipeline
  )

  t.deepEqual(result?.serialise(), {
    ...default_in_parallel_step,
    in_parallel: {
      fail_fast: undefined,
      limit: undefined,
      steps: [default_in_parallel_step],
    },
  })
})

test('writes limit', async (t) => {
  const { result } = await chain(
    'a',
    { in_parallel: { steps: [], limit: 4 } },
    default_pipeline
  )

  t.deepEqual(result?.serialise(), {
    ...default_in_parallel_step,
    in_parallel: {
      fail_fast: undefined,
      limit: 4,
      steps: [],
    },
  })
})

test('writes fail_fast', async (t) => {
  const { result } = await chain(
    'a',
    { in_parallel: { steps: [], fail_fast: false } },
    default_pipeline
  )

  t.deepEqual(result?.serialise(), {
    ...default_in_parallel_step,
    in_parallel: {
      fail_fast: undefined,
      limit: undefined,
      steps: [],
    },
  })
})
