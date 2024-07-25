import test from 'ava'
import * as ts from 'typescript'

import { Type } from '../../index.js'
import { Job } from '../../components/index.js'
import { Identifier } from '../../utils/index.js'

import { write_pipeline } from './pipeline.js'
import {
  default_job,
  default_load_var_step,
  default_pipeline,
} from '../../components/step/test-data/default-steps.js'

const chain = (name: string, input: Type.Pipeline) => {
  const code = `
    import {Pipeline, Job, LoadVarStep} from '../../components/index.js'

    ${write_pipeline(name, input)}
  `

  const result = ts.transpileModule(code, {
    reportDiagnostics: true,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      strict: true,
    },
  })

  const job: Job = eval(result.outputText)

  return {
    result: job.serialise(),
    diagnostics: result.diagnostics,
  }
}

test('writes empty pipeline', (t) => {
  const pipeline: Type.Pipeline = {
    jobs: [],
  }

  const { result, diagnostics } = chain('a', pipeline)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, default_pipeline)
})

test('writes display', (t) => {
  const pipeline: Type.Pipeline = {
    jobs: [],
    display: {
      background_image: 'https://example.com/image.jpg',
    },
  }

  const { result, diagnostics } = chain('a', pipeline)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, { ...default_pipeline, ...pipeline })
})

test('writes var_sources', (t) => {
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

  const { result, diagnostics } = chain('a', pipeline)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, { ...default_pipeline, ...pipeline })
})

test('writes groups', (t) => {
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

  const { result, diagnostics } = chain('a', pipeline)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
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

test('writes ungrouped jobs', (t) => {
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

  const { result, diagnostics } = chain('a', pipeline)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
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
