import path from 'node:path'
import fs from 'node:fs/promises'

import test from 'ava'
import { tsImport } from 'tsx/esm/api'

import { Type } from '../../index.js'
import { Identifier } from '../../utils/index.js'

import { write_pipeline } from './pipeline.js'
import {
  default_job,
  default_load_var_step,
  default_pipeline,
} from '../../components/step/test-data/default-steps.js'

const chain = async (name: string, input: Type.Pipeline) => {
  const code = `
    import {Pipeline, Job, LoadVarStep} from '../../components/index.js'

    export default ${write_pipeline(name, input)}
  `

  const tmpDir = await fs.mkdtemp(path.join(import.meta.dirname))
  const tmpPath = path.join(tmpDir, 'step.ts')

  await fs.writeFile(tmpPath, code, 'utf-8')

  const loaded = await tsImport(tmpPath, import.meta.url)

  await fs.rm(tmpDir, { recursive: true, force: true })

  return { result: loaded.default, code }
}

test('writes empty pipeline', async (t) => {
  const pipeline: Type.Pipeline = {
    jobs: [],
  }

  const { result } = await chain('a', pipeline)

  t.deepEqual(result?.serialise(), default_pipeline)
})

test('writes display', async (t) => {
  const pipeline: Type.Pipeline = {
    jobs: [],
    display: {
      background_image: 'https://example.com/image.jpg',
      background_filter: 'blur(5px)',
    },
  }

  const { result } = await chain('a', pipeline)

  t.deepEqual(result?.serialise(), { ...default_pipeline, ...pipeline })
})

test('writes var_sources', async (t) => {
  const pipeline: Type.Pipeline = {
    jobs: [],
    var_sources: [
      {
        name: 'dummy',
        type: 'dummy',
        config: {
          vars: {
            my_var: '1',
          },
        },
      },
    ],
  }

  const { result } = await chain('a', pipeline)

  t.deepEqual(result?.serialise(), { ...default_pipeline, ...pipeline })
})

test('writes groups', async (t) => {
  const pipeline: Type.Pipeline = {
    groups: [
      {
        name: 'g' as Identifier,
        jobs: ['a_job-0' as Identifier],
      },
    ],
    jobs: [
      {
        name: 'a_job-0' as Identifier,
        plan: [
          {
            load_var: 'asd' as Identifier,
            file: 'my-file',
          },
        ],
      },
    ],
  }

  const { result } = await chain('a', pipeline)

  t.deepEqual(result?.serialise(), {
    ...default_pipeline,
    ...pipeline,
    jobs: [
      {
        ...default_job,
        name: 'a_job-0',
        plan: [
          {
            ...default_load_var_step,
            file: 'my-file',
            load_var: 'asd',
          },
        ],
      },
    ],
  })
})

test('writes ungrouped jobs', async (t) => {
  const pipeline: Type.Pipeline = {
    jobs: [
      {
        name: 'a_job-0' as Identifier,
        plan: [
          {
            load_var: 'asd' as Identifier,
            file: 'my-file',
          },
        ],
      },
    ],
  }

  const { result } = await chain('a', pipeline)

  t.deepEqual(result?.serialise(), {
    ...default_pipeline,
    ...pipeline,
    jobs: [
      {
        ...default_job,
        name: 'a_job-0',
        plan: [
          {
            ...default_load_var_step,
            file: 'my-file',
            load_var: 'asd',
          },
        ],
      },
    ],
  })
})
