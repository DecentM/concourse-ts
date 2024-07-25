import path from 'node:path'
import fs from 'node:fs/promises'

import test from 'ava'
import { tsImport } from 'tsx/esm/api'

import { Type } from '../../../index.js'
import { TaskStep } from '../../../components/index.js'
import { Identifier } from '../../../utils/index.js'

import { write_task_step } from './task.js'
import { default_task_step } from '../../../components/step/test-data/default-steps.js'

const chain = async (
  name: string,
  input: Type.TaskStep,
  pipeline: Type.Pipeline
) => {
  const code = `
    import {TaskStep} from '../../../components/index.js'

    export default ${write_task_step(name, input, pipeline)}
  `

  const tmpDir = await fs.mkdtemp(path.join(import.meta.dirname))
  const tmpPath = path.join(tmpDir, 'step.ts')

  await fs.writeFile(tmpPath, code, 'utf-8')

  const loaded = await tsImport(tmpPath, import.meta.url)

  await fs.rm(tmpDir, { recursive: true, force: true })

  return { result: loaded.default, code }
}

const default_pipeline: Type.Pipeline = {
  jobs: [],
}

test('writes empty step', async (t) => {
  const { result } = await chain('a', { task: 'at' as Identifier }, default_pipeline)

  t.deepEqual(result?.serialise(), {
    ...default_task_step,
    task: 'a_task',
  })
})

test('writes file', async (t) => {
  const { result } = await chain(
    'a',
    { task: 'at' as Identifier, file: 'my-file.yml' },
    default_pipeline
  )

  t.deepEqual(result?.serialise(), {
    ...default_task_step,
    file: 'my-file.yml',
    task: 'a_task',
  })
})

test('writes image', async (t) => {
  const { result } = await chain(
    'a',
    { task: 'at' as Identifier, image: 'my-image' as Identifier },
    default_pipeline
  )

  t.deepEqual(result?.serialise(), {
    ...default_task_step,
    image: 'my-image',
    task: 'a_task',
  })
})

test('writes privileged', async (t) => {
  const { result } = await chain(
    'a',
    { task: 'at' as Identifier, privileged: true },
    default_pipeline
  )

  t.deepEqual(result?.serialise(), {
    ...default_task_step,
    privileged: true,
    task: 'a_task',
  })
})

test('writes vars', async (t) => {
  const { result } = await chain(
    'a',
    { task: 'at' as Identifier, vars: { my_var: '1' } },
    default_pipeline
  )

  t.deepEqual(result?.serialise(), {
    ...default_task_step,
    vars: { my_var: '1' },
    task: 'a_task',
  })
})

test('writes params', async (t) => {
  const { result } = await chain(
    'a',
    { task: 'at' as Identifier, params: { my_param: '1' } },
    default_pipeline
  )

  t.deepEqual(result?.serialise(), {
    ...default_task_step,
    params: { my_param: '1' },
    task: 'a_task',
  })
})

test('writes input_mapping', async (t) => {
  const { result } = await chain(
    'a',
    {
      task: 'at' as Identifier,
      input_mapping: { input: 'mapped' } as Record<Identifier, Identifier>,
    },
    default_pipeline
  )

  t.deepEqual(result?.serialise(), {
    ...default_task_step,
    input_mapping: { input: 'mapped' },
    task: 'a_task',
  })
})

test('writes output_mapping', async (t) => {
  const { result } = await chain(
    'a',
    {
      task: 'at' as Identifier,
      output_mapping: { output: 'mapped' } as Record<Identifier, Identifier>,
    },
    default_pipeline
  )

  t.deepEqual(result?.serialise(), {
    ...default_task_step,
    config: undefined,
    output_mapping: { output: 'mapped' },
    task: 'a_task',
  })
})
