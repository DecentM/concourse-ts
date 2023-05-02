import test from 'ava'
import * as ts from 'typescript'

import {Type} from '../../..'
import {PutStep} from '../../../components'
import {Identifier} from '../../../utils'

import {write_put_step} from './put'
import {default_put_step} from '../../../components/step/test-data/default-steps'

const chain = (name: string, input: Type.PutStep, pipeline: Type.Pipeline) => {
  const code = `
    import {PutStep, Resource, ResourceType} from '../../../components'

    ${write_put_step(name, input, pipeline)}
  `

  const transpiled = ts.transpileModule(code, {
    reportDiagnostics: true,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      strict: true,
    },
  })

  const result: PutStep = eval(transpiled.outputText)

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
    {put: 'a' as Identifier},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_put_step,
    put: 'a',
  })
})

test('writes empty step from alias', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {put: 'b' as Identifier, resource: 'a' as Identifier},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_put_step,
    put: 'a',
  })
})

test('writes inputs', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {put: 'a' as Identifier, inputs: 'detect'},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_put_step,
    put: 'a',
    inputs: 'detect',
  })
})

test('writes params', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {put: 'a' as Identifier, params: {my_param: '1'}},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_put_step,
    put: 'a',
    params: {
      my_param: '1',
    },
  })
})

test('writes get_params', (t) => {
  const {result, diagnostics} = chain(
    'a',
    {put: 'a' as Identifier, get_params: {my_param: '1'}},
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_put_step,
    put: 'a',
    get_params: {
      my_param: '1',
    },
  })
})
