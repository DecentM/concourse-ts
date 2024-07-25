import path from 'node:path'
import fs from 'node:fs/promises'

import test from 'ava'
import { tsImport } from 'tsx/esm/api'

import { Type } from '../../../index.js'
import { LoadVarStep } from '../../../components/index.js'
import { Identifier } from '../../../utils/index.js'

import { write_load_var_step } from './load-var.js'
import { default_load_var_step } from '../../../components/step/test-data/default-steps.js'

const chain = async (
  name: string,
  input: Type.LoadVarStep,
  pipeline: Type.Pipeline
) => {
  const code = `
    import {LoadVarStep} from '../../../components/index.js'

    export default ${write_load_var_step(name, input, pipeline)}
  `

  const tmpDir = await fs.mkdtemp(path.join(import.meta.dirname))

  let error: Error | null = null
  let result: LoadVarStep | null = null

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
    { load_var: 'my-var' as Identifier, file: 'my-file' },
    default_pipeline
  )

  t.is(error, null)
  t.deepEqual(result?.serialise(), {
    ...default_load_var_step,
    file: 'my-file',
    load_var: 'my-var',
  })
})

test('writes format', async (t) => {
  const { result, error } = await chain(
    'a',
    { load_var: 'my-var' as Identifier, file: 'my-file', format: 'json' },
    default_pipeline
  )

  t.is(error, null)
  t.deepEqual(result?.serialise(), {
    ...default_load_var_step,
    file: 'my-file',
    load_var: 'my-var',
    format: 'json',
  })
})

test('writes reveal', async (t) => {
  const { result, error } = await chain(
    'a',
    { load_var: 'my-var' as Identifier, file: 'my-file', reveal: false },
    default_pipeline
  )

  t.is(error, null)
  t.deepEqual(result?.serialise(), {
    ...default_load_var_step,
    file: 'my-file',
    load_var: 'my-var',
    reveal: false,
  })
})
