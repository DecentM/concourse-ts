import test from 'ava'
import * as ts from 'typescript'

import { Type } from '../../..'
import { LoadVarStep } from '../../../components'
import { Identifier } from '../../../utils/index.js'

import { write_load_var_step } from './load-var'
import { default_load_var_step } from '../../../components/step/test-data/default-steps'

const chain = (name: string, input: Type.LoadVarStep, pipeline: Type.Pipeline) => {
  const code = `
    import {LoadVarStep} from '../../../components'

    ${write_load_var_step(name, input, pipeline)}
  `

  const transpiled = ts.transpileModule(code, {
    reportDiagnostics: true,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      strict: true,
    },
  })

  const result: LoadVarStep = eval(transpiled.outputText)

  return {
    result: result.serialise(),
    diagnostics: transpiled.diagnostics,
  }
}

const default_pipeline: Type.Pipeline = {
  jobs: [],
}

test('writes empty step', (t) => {
  const { result, diagnostics } = chain(
    'a',
    { load_var: 'my-var' as Identifier, file: 'my-file' },
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_load_var_step,
    file: 'my-file',
    load_var: 'my-var',
  })
})

test('writes format', (t) => {
  const { result, diagnostics } = chain(
    'a',
    { load_var: 'my-var' as Identifier, file: 'my-file', format: 'json' },
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_load_var_step,
    file: 'my-file',
    load_var: 'my-var',
    format: 'json',
  })
})

test('writes reveal', (t) => {
  const { result, diagnostics } = chain(
    'a',
    { load_var: 'my-var' as Identifier, file: 'my-file', reveal: false },
    default_pipeline
  )

  t.deepEqual(diagnostics, [])
  t.deepEqual(result, {
    ...default_load_var_step,
    file: 'my-file',
    load_var: 'my-var',
    reveal: false,
  })
})
