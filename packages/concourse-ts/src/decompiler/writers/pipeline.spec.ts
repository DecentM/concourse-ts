import test from 'ava'
import * as ts from 'typescript'

import {Type} from '../..'
import {Job} from '../../components'
import {Identifier} from '../../utils'

import {write_pipeline} from './pipeline'

const chain = (name: string, input: Type.Pipeline) => {
  const code = `
    import {Pipeline, Job, LoadVarStep} from '../../components'

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

const default_pipeline = {
  display: undefined,
  groups: [],
  jobs: [],
  resource_types: [],
  resources: [],
  var_sources: [],
}

const default_job = {
  max_in_flight: undefined,
  plan: [],
  build_log_retention: undefined,
  build_logs_to_retain: undefined,
  disable_manual_trigger: undefined,
  ensure: undefined,
  interruptible: undefined,
  old_name: undefined,
  on_abort: undefined,
  on_error: undefined,
  on_failure: undefined,
  on_success: undefined,
  public: undefined,
  serial: undefined,
  serial_groups: undefined,
}

const default_step = {
  attempts: undefined,
  ensure: undefined,
  on_abort: undefined,
  on_error: undefined,
  on_failure: undefined,
  on_success: undefined,
  tags: undefined,
  timeout: undefined,
}

const default_load_var_step = {
  ...default_step,
  file: undefined,
  format: undefined,
  load_var: undefined,
  reveal: undefined,
}

test('writes empty pipeline', (t) => {
  const pipeline: Type.Pipeline = {
    jobs: [],
  }

  const {result, diagnostics} = chain('a', pipeline)

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

  const {result, diagnostics} = chain('a', pipeline)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {...default_pipeline, ...pipeline})
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

  const {result, diagnostics} = chain('a', pipeline)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {...default_pipeline, ...pipeline})
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

  const {result, diagnostics} = chain('a', pipeline)

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

  const {result, diagnostics} = chain('a', pipeline)

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
