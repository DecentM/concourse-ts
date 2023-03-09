import test from 'ava'
import * as ts from 'typescript'

import {Type} from '../../..'
import {GetStep} from '../../../components'
import {Identifier} from '../../../utils'

import {write_get_step} from './get'

const chain = (name: string, input: Type.GetStep, pipeline: Type.Pipeline) => {
  const code = `
    import {GetStep} from '../../../components'

    ${write_get_step(name, input, pipeline)}
  `

  const transpiled = ts.transpileModule(code, {
    reportDiagnostics: true,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      strict: true,
    },
  })

  const result: GetStep = eval(transpiled.outputText)

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
  tags: [],
  timeout: undefined,
}

const default_get_step = {
  ...default_step,
  get: undefined,
  params: undefined,
  passed: [],
  trigger: undefined,
  version: undefined,
  resource: undefined,
}

const default_pipeline: Type.Pipeline = {
  resources: [
    {
      name: 'a' as Identifier,
      type: 'registry-image' as Identifier,
      source: {},
    },
  ],
  jobs: [],
}

test('writes empty step', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {get: 'a' as Identifier},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, default_get_step)
})

test('writes passed', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {get: 'a' as Identifier, passed: ['step-a', 'step-b'] as Identifier[]},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {...default_get_step, passed: ['step-a', 'step-b']})
})

test('writes params', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {get: 'a' as Identifier, params: {my_param: '1'}},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {...default_get_step, params: {my_param: '1'}})
})

test('writes trigger', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {get: 'a' as Identifier, trigger: false},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {...default_get_step, trigger: false})
})

test('writes version', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {get: 'a' as Identifier, version: 'latest'},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {...default_get_step, version: 'latest'})
})
