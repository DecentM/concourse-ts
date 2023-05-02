import test from 'ava'
import * as ts from 'typescript'

import {Type} from '../../..'
import {GetStep} from '../../../components'
import {Identifier} from '../../../utils'

import {write_get_step} from './get'
import {default_get_step} from '../../../components/step/test-data/default-steps'

const chain = (name: string, input: Type.GetStep, pipeline: Type.Pipeline) => {
  const code = `
    import {GetStep, Resource, ResourceType} from '../../../components'

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

const default_pipeline: Type.Pipeline = {
  resource_types: [
    {
      name: 'at' as Identifier,
      type: 'registry-image' as Identifier,
      source: {},
    },
  ],
  resources: [
    {
      name: 'a' as Identifier,
      type: 'at' as Identifier,
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
  t.deepEqual(result, {...default_get_step, get: 'a'})
})

test('writes empty step from resource property', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {get: 'b' as Identifier, resource: 'a' as Identifier},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {...default_get_step, get: 'a'})
})

test('writes passed', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {get: 'a' as Identifier, passed: ['step-a', 'step-b'] as Identifier[]},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_get_step,
    get: 'a',
    passed: ['step-a', 'step-b'],
  })
})

test('writes params', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {get: 'a' as Identifier, params: {my_param: '1'}},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {...default_get_step, get: 'a', params: {my_param: '1'}})
})

test('writes trigger', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {get: 'a' as Identifier, trigger: false},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {...default_get_step, get: 'a', trigger: false})
})

test('writes version', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {get: 'a' as Identifier, version: 'latest'},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {...default_get_step, get: 'a', version: 'latest'})
})
