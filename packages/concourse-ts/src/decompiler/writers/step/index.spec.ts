import test from 'ava'
import * as ts from 'typescript'

import {Type} from '../../..'

import {write_step} from '.'
import {AnyStep} from '../../../declarations'
import {Identifier} from '../../../utils'

const chain = (name: string, input: Type.Step, pipeline: Type.Pipeline) => {
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
    } from '../../../components'

    ${write_step(name, input, pipeline)}
  `

  const transpiled = ts.transpileModule(code, {
    reportDiagnostics: true,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      strict: true,
    },
  })

  const result: AnyStep = eval(transpiled.outputText)

  return {
    result: result.serialise(),
    diagnostics: transpiled.diagnostics,
  }
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

test('throws when passed invalid input', (t) => {
  t.throws(
    () => {
      chain(
        'a',
        {
          asdasdasd: 1,
        } as unknown as Type.Step,
        default_pipeline
      )
    },
    {
      message:
        'Step "a" cannot be stringified to code as it\'s not a recognised type',
    }
  )
})

test('writes do steps', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {
      ...default_step,
      do: [],
    },
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_step,
    do: [],
  })
})

test('writes get steps', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {
      ...default_step,
      get: 'a' as Identifier,
    },
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_step,
    params: undefined,
    passed: undefined,
    resource: undefined,
    trigger: undefined,
    version: undefined,
    get: 'a',
  })
})

test('writes in_parallel steps', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {
      ...default_step,
      in_parallel: [],
    },
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_step,
    in_parallel: {
      fail_fast: undefined,
      limit: undefined,
      steps: [],
    },
  })
})

test('writes load_var steps', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {
      ...default_step,
      load_var: 'my-var' as Identifier,
      file: 'my-file',
    },
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_step,
    load_var: 'my-var',
    file: 'my-file',
    format: undefined,
    reveal: undefined,
  })
})

test('writes put steps', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {
      ...default_step,
      put: 'a' as Identifier,
    },
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_step,
    put: 'a',
    get_params: undefined,
    inputs: undefined,
    params: undefined,
    resource: undefined,
  })
})

test('writes set_pipeline steps', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {
      ...default_step,
      set_pipeline: 'self',
      file: 'my-file',
    },
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_step,
    set_pipeline: 'self',
    file: 'my-file',
    instance_vars: undefined,
    team: undefined,
    var_files: undefined,
    vars: undefined,
  })
})

test('writes task steps', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {
      ...default_step,
      task: 'b' as Identifier,
    },
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
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

test('writes try steps', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {
      ...default_step,
      try: {
        do: [],
      },
    },
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_step,
    try: {
      ...default_step,
      do: [],
    },
  })
})
