import path from 'node:path'
import fs from 'node:fs/promises'

import test from 'ava'
import { tsImport } from 'tsx/esm/api'

import { Type } from '../../../index.js'
import { DoStep } from '../../../components/index.js'

import { write_do_step } from './do.js'
import { default_do_step } from '../../../components/step/test-data/default-steps.js'

const chain = async (name: string, input: Type.DoStep, pipeline: Type.Pipeline) => {
  const code = `
    import {DoStep} from '../../../components/index.js'

    export default ${write_do_step(name, input, pipeline)}
  `

  const tmpDir = await fs.mkdtemp(path.join(import.meta.dirname))

  let error: Error | null = null
  let result: DoStep | null = null

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
  const { result, error } = await chain('a', { do: [] }, default_pipeline)

  t.is(error, null)
  t.deepEqual(result?.serialise(), default_do_step)
})

test('writes steps', async (t) => {
  const { result, error } = await chain(
    'a',
    { do: [default_do_step] },
    default_pipeline
  )

  t.is(error, null)
  t.deepEqual(result?.serialise(), { ...default_do_step, do: [default_do_step] })
})
