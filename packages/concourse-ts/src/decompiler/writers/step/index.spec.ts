import path from 'node:path'
import fs from 'node:fs/promises'

import test from 'ava'
import { tsImport } from 'tsx/esm/api'

import { Type } from '../../../index.js'

import { write_step } from './index.js'
import { AnyStep } from '../../../declarations/index.js'
import { Identifier } from '../../../utils/index.js'
import { default_step } from '../../../components/step/test-data/default-steps.js'

const chain = async (name: string, input: Type.Step, pipeline: Type.Pipeline) => {
  const code = `
    import {
      DoStep,
      GetStep,
      InParallelStep,
      LoadVarStep,
      PutStep,
      SetPipelineStep,
      TaskStep,
      TryStep,
      Resource,
      ResourceType
    } from '../../../components/index.js'

    export default ${write_step(name, input, pipeline)}
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
  resources: [
    {
      name: 'a' as Identifier,
      type: 'my-rt' as Identifier,
      source: {},
    },
  ],
  resource_types: [
    {
      name: 'my-rt' as Identifier,
      type: 'registry-image' as Identifier,
      source: {},
    },
  ],
}

test('throws when passed invalid input', async (t) => {
  await t.throwsAsync(
    () =>
      chain(
        'a',
        {
          asdasdasd: 1,
        } as unknown as Type.Step,
        default_pipeline
      ),
    {
      any: true,
      message:
        'Step "a" cannot be stringified to code as it\'s not a recognised type',
    }
  )
})

test('writes do steps', async (t) => {
  const { result } = await chain(
    'a',
    {
      ...default_step,
      do: [],
    },
    default_pipeline
  )

  t.deepEqual(result?.serialise(), {
    ...default_step,
    do: [],
  })
})

test('writes get steps', async (t) => {
  const { result } = await chain(
    'a',
    {
      ...default_step,
      get: 'a' as Identifier,
    },
    default_pipeline
  )

  t.deepEqual(result?.serialise(), {
    ...default_step,
    params: undefined,
    passed: undefined,
    resource: undefined,
    trigger: undefined,
    version: undefined,
    get: 'a',
  })
})

test('writes in_parallel steps', async (t) => {
  const { result } = await chain(
    'a',
    {
      ...default_step,
      in_parallel: [],
    },
    default_pipeline
  )

  t.deepEqual(result?.serialise(), {
    ...default_step,
    in_parallel: {
      fail_fast: undefined,
      limit: undefined,
      steps: [],
    },
  })
})

test('writes load_var steps', async (t) => {
  const { result } = await chain(
    'a',
    {
      ...default_step,
      load_var: 'my-var' as Identifier,
      file: 'my-file',
    },
    default_pipeline
  )

  t.deepEqual(result?.serialise(), {
    ...default_step,
    load_var: 'my-var',
    file: 'my-file',
    format: undefined,
    reveal: undefined,
  })
})

test('writes put steps', async (t) => {
  const { result } = await chain(
    'a',
    {
      ...default_step,
      put: 'a' as Identifier,
    },
    default_pipeline
  )

  t.deepEqual(result?.serialise(), {
    ...default_step,
    put: 'a',
    get_params: undefined,
    inputs: undefined,
    params: undefined,
    resource: undefined,
    no_get: undefined,
  })
})

test('writes set_pipeline steps', async (t) => {
  const { result } = await chain(
    'a',
    {
      ...default_step,
      set_pipeline: 'self',
      file: 'my-file',
    },
    default_pipeline
  )

  t.deepEqual(result?.serialise(), {
    ...default_step,
    set_pipeline: 'self',
    file: 'my-file',
    instance_vars: undefined,
    team: undefined,
    var_files: undefined,
    vars: undefined,
  })
})

test('writes task steps', async (t) => {
  const { result } = await chain(
    'a',
    {
      ...default_step,
      task: 'b' as Identifier,
    },
    default_pipeline
  )

  t.deepEqual(result?.serialise(), {
    ...default_step,
    task: 'a_task',
    config: undefined,
    file: undefined,
    image: undefined,
    input_mapping: undefined,
    output_mapping: undefined,
    params: undefined,
    privileged: undefined,
    vars: undefined,
  })
})

test('writes try steps', async (t) => {
  const { result } = await chain(
    'a',
    {
      ...default_step,
      try: {
        do: [],
      },
    },
    default_pipeline
  )

  t.deepEqual(result?.serialise(), {
    ...default_step,
    try: {
      ...default_step,
      do: [],
    },
  })
})
