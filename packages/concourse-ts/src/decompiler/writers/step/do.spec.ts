import path from 'node:path'
import fs from 'node:fs/promises'

import test from 'ava'
import { tsImport } from 'tsx/esm/api'

import { Type } from '../../../index.js'

import { write_do_step } from './do.js'
import { default_do_step } from '../../../components/step/test-data/default-steps.js'

const chain = async (name: string, input: Type.DoStep, pipeline: Type.Pipeline) => {
  const code = `
    import {DoStep} from '../../../components/index.js'

    export default ${write_do_step(name, input, pipeline)}
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
  const { result } = await chain('a', { do: [] }, default_pipeline)

  t.deepEqual(result?.serialise(), default_do_step)
})

test('writes steps', async (t) => {
  const { result } = await chain('a', { do: [default_do_step] }, default_pipeline)

  t.deepEqual(result?.serialise(), { ...default_do_step, do: [default_do_step] })
})
