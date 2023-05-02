import test from 'ava'
import * as ts from 'typescript'

import {Type} from '../../..'
import {InParallelStep} from '../../../components'

import {write_in_parallel_step} from './in-parallel'
import {default_in_parallel_step} from '../../../components/step/test-data/default-steps'

const chain = (
  name: string,
  input: Type.InParallelStep,
  pipeline: Type.Pipeline
) => {
  const code = `
    import {InParallelStep} from '../../../components'

    ${write_in_parallel_step(name, input, pipeline)}
  `

  const transpiled = ts.transpileModule(code, {
    reportDiagnostics: true,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      strict: true,
    },
  })

  const result: InParallelStep = eval(transpiled.outputText)

  return {
    result: result.serialise(),
    diagnostics: transpiled.diagnostics,
  }
}

const default_pipeline: Type.Pipeline = {
  jobs: [],
}

test('writes empty step', (t) => {
  const {result, diagnostics} = chain('a', {in_parallel: []}, default_pipeline)

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, default_in_parallel_step)
})

test('writes steps', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {in_parallel: {steps: [default_in_parallel_step]}},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_in_parallel_step,
    in_parallel: {
      fail_fast: undefined,
      limit: undefined,
      steps: [default_in_parallel_step],
    },
  })
})

test('writes limit', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {in_parallel: {steps: [], limit: 4}},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_in_parallel_step,
    in_parallel: {
      fail_fast: undefined,
      limit: 4,
      steps: [],
    },
  })
})

test('writes fail_fast', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {in_parallel: {steps: [], fail_fast: false}},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_in_parallel_step,
    in_parallel: {
      fail_fast: false,
      limit: undefined,
      steps: [],
    },
  })
})
