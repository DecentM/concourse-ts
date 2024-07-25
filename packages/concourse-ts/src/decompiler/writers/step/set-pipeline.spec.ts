import path from 'node:path'
import fs from 'node:fs/promises'

import test from 'ava'

import { Type } from '../../../index.js'
import { SetPipelineStep } from '../../../components/index.js'
import { Identifier } from '../../../utils/index.js'

import { write_set_pipeline_step } from './set-pipeline.js'
import { default_set_pipeline_step } from '../../../components/step/test-data/default-steps.js'
import { tsImport } from 'tsx/esm/api'

const chain = async (
  name: string,
  input: Type.SetPipelineStep,
  pipeline: Type.Pipeline
) => {
  const code = `
    import {SetPipelineStep} from '../../../components/index.js'

    export default ${write_set_pipeline_step(name, input, pipeline)}
  `

  const tmpDir = await fs.mkdtemp(path.join(import.meta.dirname))

  let error: Error | null = null
  let result: SetPipelineStep | null = null

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

const default_pipeline: Type.Pipeline = {
  jobs: [],
}

test('writes empty step', async (t) => {
  const { result, error } = await chain(
    'a',
    { set_pipeline: 'self', file: 'my-file' },
    default_pipeline
  )

  t.is(error, null)
  t.deepEqual(result?.serialise(), {
    ...default_set_pipeline_step,
    file: 'my-file',
    set_pipeline: 'self',
  })
})

test('writes instance_vars', async (t) => {
  const { result, error } = await chain(
    'a',
    { set_pipeline: 'self', file: 'my-file', instance_vars: { my_var: '1' } },
    default_pipeline
  )

  t.is(error, null)
  t.deepEqual(result?.serialise(), {
    ...default_set_pipeline_step,
    file: 'my-file',
    set_pipeline: 'self',
    instance_vars: { my_var: '1' },
  })
})

test('writes vars', async (t) => {
  const { result, error } = await chain(
    'a',
    { set_pipeline: 'self', file: 'my-file', vars: { my_var: '1' } },
    default_pipeline
  )

  t.is(error, null)
  t.deepEqual(result?.serialise(), {
    ...default_set_pipeline_step,
    file: 'my-file',
    set_pipeline: 'self',
    vars: { my_var: '1' },
  })
})

test('writes var_files', async (t) => {
  const { result, error } = await chain(
    'a',
    { set_pipeline: 'self', file: 'my-file', var_files: ['file-a', 'file-b'] },
    default_pipeline
  )

  t.is(error, null)
  t.deepEqual(result?.serialise(), {
    ...default_set_pipeline_step,
    file: 'my-file',
    set_pipeline: 'self',
    var_files: ['file-a', 'file-b'],
  })
})

test('writes team', async (t) => {
  const { result, error } = await chain(
    'a',
    { set_pipeline: 'self', file: 'my-file', team: 'my-team' as Identifier },
    default_pipeline
  )

  t.is(error, null)
  t.deepEqual(result?.serialise(), {
    ...default_set_pipeline_step,
    file: 'my-file',
    set_pipeline: 'self',
    team: 'my-team',
  })
})
