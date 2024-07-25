import path from 'node:path'
import fs from 'node:fs/promises'
import test from 'ava'
import { tsImport } from 'tsx/esm/api'

import { Type } from '../../../index.js'
import { Platform } from '../../../declarations/index.js'
import { Duration, Identifier } from '../../../utils/index.js'

import { write_step_base } from './base.js'

const chain = async (name: string, input: Type.Step, pipeline: Type.Pipeline) => {
  const code = `
    import {TaskStep, Task, Command} from '../../../components/index.js'

    let step: any

    export default function () {
      ${write_step_base('step', name, input, pipeline)}
    }
  `

  const tmpDir = await fs.mkdtemp(path.join(import.meta.dirname))
  const tmpPath = path.join(tmpDir, 'step.ts')

  await fs.writeFile(tmpPath, code, 'utf-8')

  const loaded = await tsImport(tmpPath, import.meta.url)

  await fs.rm(tmpDir, { recursive: true, force: true })

  return { result: loaded.default, code }
}

const default_step = {
  task: 'ajt' as Identifier,
  config: {
    platform: 'linux' as Platform,
    image_resource: {
      type: 'registry-image' as Identifier,
      source: {},
    },
    run: {
      path: 'echo',
      args: [],
    },
  },
}

const default_pipeline: Type.Pipeline = {
  jobs: [
    {
      name: 'aj' as Identifier,
      plan: [],
    },
  ],
}

test('writes empty step modifiers', async (t) => {
  await t.notThrowsAsync(async () => {
    await chain('a', default_step, default_pipeline)
  })
})

test('writes attempts', async (t) => {
  const { code } = await chain(
    'a',
    { ...default_step, attempts: 5 },
    default_pipeline
  )

  t.assert(code.includes('attempts = 5'))
})

test('writes tags', async (t) => {
  await t.notThrowsAsync(async () => {
    const { code } = await chain(
      'a',
      { ...default_step, tags: ['tag-a', 'tag-b'] },
      default_pipeline
    )

    t.assert(code.includes('step.add_tag("tag-a", "tag-b")'))
  })
})

test('writes timeout', async (t) => {
  const { code } = await chain(
    'a',
    { ...default_step, timeout: '1h2m' as Duration },
    default_pipeline
  )

  t.assert(code.includes('step.set_timeout({"hours":1,"minutes":2})'))
})

test('writes across', async (t) => {
  const across0 = {
    values: ['value-a', 'value-b'],
    var: 'my-var' as Identifier,
    fail_fast: true,
    max_in_flight: 2,
  }

  const { code } = await chain(
    'a',
    {
      ...default_step,
      across: [across0],
    },
    default_pipeline
  )

  t.assert(code.includes(`step.add_across(${JSON.stringify(across0)})`))
})

test('writes ensure', async (t) => {
  const { code } = await chain(
    'a',
    { ...default_step, ensure: default_step },
    default_pipeline
  )

  t.assert(code.includes('step.add_ensure(new TaskStep'))
})

test('writes on_success', async (t) => {
  const { code } = await chain(
    'a',
    { ...default_step, on_success: default_step },
    default_pipeline
  )

  t.assert(code.includes('step.add_on_success(new TaskStep'))
})

test('writes on_error', async (t) => {
  const { code } = await chain(
    'a',
    { ...default_step, on_error: default_step },
    default_pipeline
  )

  t.assert(code.includes('step.add_on_error(new TaskStep'))
})

test('writes on_failure', async (t) => {
  const { code } = await chain(
    'a',
    { ...default_step, on_failure: default_step },
    default_pipeline
  )

  t.assert(code.includes('step.add_on_failure(new TaskStep'))
})

test('writes on_abort', async (t) => {
  const { code } = await chain(
    'a',
    { ...default_step, on_abort: default_step },
    default_pipeline
  )

  t.assert(code.includes('step.add_on_abort(new TaskStep'))
})
